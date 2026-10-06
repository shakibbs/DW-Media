import { lazy, Suspense, useRef, useState } from "react";
import { portfolio, type Project } from "@/lib/studio";
import { pad, useCinema } from "./motion";

import { WorkBook } from "./work-book";
const STEP = 1.3;
const TRANSITION = 0.95;

/** SCENE 04 — a digital exhibition. Each production owns the viewport; clicking opens the 3D Work Book. */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLElement>(null);
  const [bookIndex, setBookIndex] = useState<number | null>(null);
  const n = portfolio.length;

  const open = (index: number) => {
    setBookIndex(index);
  };

  useCinema(root, ({ gsap, isMobile }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const projs = gsap.utils.toArray<HTMLElement>(q(".proj"));

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: `+=${Math.max(1, n) * (isMobile ? 85 : 110)}%`,
        pin: (q(".work-pin")[0] as HTMLElement) ?? true,
        scrub: 0.8,
        snap: { snapTo: "labels", duration: { min: 0.25, max: 0.8 }, delay: 0.06, ease: "power1.inOut" },
        onUpdate: (self) => {
          const tm = self.progress * (self.animation?.duration() ?? 1);
          let idx = 0;
          for (let k = 1; k < n; k++) if (tm >= 0.9 + (k - 1) * STEP + 0.4 + TRANSITION * 0.5) idx = k;
          if (counter.current) counter.current.textContent = pad(idx + 1);
        },
      },
    });

    const parts = (p: HTMLElement) => ({
      frame: p.querySelector(".proj-frame"),
      img: p.querySelector(".proj-img"),
      title: p.querySelectorAll(".proj-title .t"),
      meta: p.querySelectorAll(".proj-meta > *"),
    });

    // First project: the camera arrives.
    const first = projs[0];
    if (first) {
      const f = parts(first);
      tl.addLabel("p0", 0.9)
        .fromTo(f.frame, { scale: 0.86, clipPath: "inset(14% 14% 14% 14%)" }, { scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }, 0)
        .fromTo(f.img, { scale: 1.35 }, { scale: 1, duration: 0.9 }, 0)
        .fromTo(f.title, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" }, 0.1)
        .fromTo(f.meta, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.4);
    }

    projs.forEach((p, i) => {
      if (i === 0) return;
      const t0 = 0.9 + (i - 1) * STEP + 0.4;
      tl.addLabel(`p${i}`, t0 + TRANSITION);
      const prev = parts(projs[i - 1]!);
      const cur = parts(p);

      // Camera pulls past the current work…
      tl.to(prev.frame, { scale: 0.82, opacity: 0, duration: TRANSITION }, t0)
        .to(prev.img, { scale: 1.4, duration: TRANSITION }, t0)
        .to(prev.title, { yPercent: -110, duration: TRANSITION * 0.8, stagger: 0.04 }, t0)
        .to(prev.meta, { opacity: 0, y: -24, duration: TRANSITION * 0.5 }, t0)
        .set(projs[i - 1]!, { autoAlpha: 0 }, t0 + TRANSITION)
        // …and settles on the next.
        .set(p, { autoAlpha: 1 }, t0)
        .fromTo(cur.frame, { scale: 1.18, opacity: 0, clipPath: "inset(30% 30% 30% 30%)" }, { scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: TRANSITION }, t0)
        .fromTo(cur.img, { scale: 1.5 }, { scale: 1, duration: TRANSITION }, t0)
        .fromTo(cur.title, { yPercent: 110 }, { yPercent: 0, duration: TRANSITION, stagger: 0.05, ease: "expo.out" }, t0 + 0.2)
        .fromTo(cur.meta, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, t0 + 0.5);
    });
    tl.to({}, { duration: 0.5 });
    projs.slice(1).forEach((p) => gsap.set(p, { autoAlpha: 0 }));

    // Pointer: the picture drifts with the cursor (CSS variables, cheap).
    const cleanup: Array<() => void> = [];
    if (!isMobile && window.matchMedia("(hover: hover)").matches) {
      projs.forEach((p) => {
        const move = (e: PointerEvent) => {
          const r = p.getBoundingClientRect();
          p.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
          p.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
        };
        p.addEventListener("pointermove", move, { passive: true });
        cleanup.push(() => p.removeEventListener("pointermove", move));
      });
    }
    return () => cleanup.forEach((c) => c());
  });

  return (
    <section id="work" ref={root} className="work" data-scene="SELECTED PRODUCTIONS">
      <div className="work-pin">
        <header className="work-head">
          <span className="eyebrow">04 — SELECTED PRODUCTIONS</span>
          <span className="svc-count" aria-hidden="true">
            <b ref={counter}>01</b> / {pad(n)}
          </span>
        </header>

        {portfolio.map((p, i) => (
          <article className="proj" key={p.title} aria-label={p.title}>
            <button
              type="button"
              className="proj-open"
              data-cursor="view"
              data-cursor-label="VIEW"
              aria-label={`Open project: ${p.title}`}
              onClick={() => open(i)}
            >
              <span className="proj-frame">
                <span className="proj-shift">
                  <img className="proj-img" src={p.image} alt={`${p.title} — ${p.category}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                </span>
                {p.status && (
                  <span className="proj-badge-upcoming">
                    {p.status}
                  </span>
                )}
              </span>
              <span className="proj-title" aria-hidden="true">
                {p.title.toUpperCase().split(" ").map((w, k) => (
                  <span className="tm" key={k}>
                    <span className="t">{w}</span>
                  </span>
                ))}
              </span>
              <span className="proj-index" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="proj-meta">
                <span>{p.category.toUpperCase()}{p.status ? ` · ${p.status}` : ""}</span>
                <span>{p.credit}</span>
                <span className="proj-more">OPEN WORK BOOK →</span>
              </span>
            </button>
          </article>
        ))}
      </div>

      <WorkBook
        isOpen={bookIndex !== null}
        initialIndex={bookIndex ?? 0}
        projectIndex={bookIndex ?? 0}
        project={bookIndex !== null ? portfolio[bookIndex] : undefined}
        onClose={() => setBookIndex(null)}
      />
    </section>
  );
}
