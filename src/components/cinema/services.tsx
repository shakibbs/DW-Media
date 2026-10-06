import { useRef } from "react";
import { Fog } from "@/components/atmosphere";
import { services } from "@/lib/studio";
import { pad, scrollToTarget, useCinema } from "./motion";

const STEP = 1.2; // timeline seconds per service
const TRANSITION = 0.85;

/** SCENE 03 — an interactive cinematic gallery: one service owns the screen, scenes change as you scroll. */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLElement>(null);
  const n = services.length;
  const total = (n - 1) * STEP + 0.4;

  useCinema(root, ({ gsap, ScrollTrigger, isMobile }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const arts = gsap.utils.toArray<HTMLElement>(q(".svc"));
    const items = gsap.utils.toArray<HTMLElement>(q(".svc-index button"));
    const lenPercent = n * (isMobile ? 80 : 95);

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: `+=${lenPercent}%`,
        pin: (q(".services-pin")[0] as HTMLElement) ?? true,
        scrub: 0.7,
        snap: { snapTo: "labels", duration: { min: 0.2, max: 0.7 }, delay: 0.06, ease: "power1.inOut" },
        onUpdate: (self) => {
          const idx = Math.min(n - 1, Math.round((self.progress * total) / STEP));
          if (counter.current) counter.current.textContent = pad(idx + 1);
          items.forEach((b, i) => b.classList.toggle("is-active", i === idx));
        },
      },
    });

    const show = (a: HTMLElement) => ({
      media: a.querySelector(".svc-media"),
      img: a.querySelector(".svc-img"),
      title: a.querySelectorAll(".svc-title"),
      fades: a.querySelectorAll(".svc-num, .svc-short, .svc-desc, .svc-frame"),
    });

    arts.forEach((a, i) => {
      tl.addLabel(`s${i}`, i * STEP);
      if (i === 0) return;
      const t0 = i * STEP - TRANSITION;
      const cur = show(a);
      const prev = show(arts[i - 1]!);

      // Outgoing scene: title rises out of its mask, picture irises away while pushing in.
      tl.to(prev.title, { yPercent: -112, duration: TRANSITION * 0.85 }, t0)
        .to(prev.fades, { opacity: 0, y: -30, duration: TRANSITION * 0.6, stagger: 0.03 }, t0)
        .to(prev.media, { clipPath: "inset(0% 0% 100% 0%)", duration: TRANSITION }, t0)
        .to(prev.img, { scale: 1.3, duration: TRANSITION }, t0)
        .set(arts[i - 1]!, { autoAlpha: 0 }, t0 + TRANSITION);

      // Incoming scene: a new frame opens from below.
      tl.set(a, { autoAlpha: 1 }, t0)
        .fromTo(cur.media, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: TRANSITION }, t0)
        .fromTo(cur.img, { scale: 1.4 }, { scale: 1, duration: TRANSITION }, t0)
        .fromTo(cur.title, { yPercent: 112 }, { yPercent: 0, duration: TRANSITION, ease: "expo.out" }, t0 + 0.12)
        .fromTo(
          cur.fades,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: TRANSITION * 0.7, stagger: 0.05, ease: "power2.out" },
          t0 + 0.25,
        );
    });
    tl.to({}, { duration: 0.4 }, (n - 1) * STEP); // hold on the last scene

    // Hidden-by-default scenes (visible state is the static fallback).
    arts.slice(1).forEach((a) => gsap.set(a, { autoAlpha: 0 }));

    // Index navigation → scroll position of the matching label.
    const st = tl.scrollTrigger!;
    items.forEach((b, i) =>
      b.addEventListener("click", () => {
        const y = st.start + ((i * STEP) / total) * (st.end - st.start);
        scrollToTarget(y);
      }),
    );

    // Pointer parallax on the pictures through CSS variables (cheap).
    if (!isMobile && window.matchMedia("(hover: hover)").matches) {
      const move = (e: PointerEvent) => {
        el.style.setProperty("--mx", String(e.clientX / window.innerWidth - 0.5));
        el.style.setProperty("--my", String(e.clientY / window.innerHeight - 0.5));
      };
      el.addEventListener("pointermove", move, { passive: true });
      return () => {
        el.removeEventListener("pointermove", move);
      };
    }
    void ScrollTrigger;
    return undefined;
  });

  return (
    <section id="services" ref={root} className="services" data-scene="WHAT WE CREATE">
      <div className="services-pin">
        <Fog tone="cool" />
        <header className="services-head">
          <span className="eyebrow">03 — WHAT WE CREATE</span>
          <span className="svc-count" aria-hidden="true">
            <b ref={counter}>01</b> / {pad(n)}
          </span>
        </header>

        <ol className="svc-index" aria-label="Services">
          {services.map((s, i) => (
            <li key={s.name}>
              <button type="button" className={i === 0 ? "is-active" : ""} data-cursor="link" aria-label={s.name}>
                <span>{pad(i + 1)}</span>
                <i />
              </button>
            </li>
          ))}
        </ol>

        {services.map((s, i) => (
          <article className="svc" key={s.name} data-world={s.world} aria-label={s.name}>
            <div className="svc-visual">
              <div className="svc-media">
                <div className="svc-drift">
                  <img
                    className="svc-img"
                    src={s.image}
                    alt={`${s.name} — reference visual`}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <span className="svc-ray" aria-hidden="true" />
              </div>
              <span className="svc-frame">{s.frame}</span>
            </div>
            <div className="svc-text">
              <span className="svc-num">{pad(i + 1)} / {pad(n)}</span>
              <h3 className="svc-title-mask">
                <span className="svc-title">{s.name.toUpperCase()}</span>
              </h3>
              <p className="svc-short">{s.short}</p>
              <p className="svc-desc">{s.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
