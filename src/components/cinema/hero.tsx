import { useRef } from "react";
import logo from "@/assets/dw-mark.asset.json";
import { services } from "@/lib/studio";
import { Atmosphere } from "@/components/atmosphere";
import { lenisRef, useCinema } from "./motion";

const WORDS = ["INNOVATE", "CREATE", "ELEVATE"] as const;
const TAG = "Complete Media & Branding Solutions.";

function Lines({ ghost = false }: { ghost?: boolean }) {
  return (
    <div className={ghost ? "hero-lines is-ghost" : "hero-lines"}>
      {WORDS.map((w) => (
        <span className="hero-line" key={w}>
          <span className="hero-word">
            {w.split("").map((c, i) => (
              <span className="ch" key={i}>
                {c}
              </span>
            ))}
            <span className="ch dot">.</span>
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * SCENE 01 — the opening ident.
 * Intro (time-based): atmosphere → light sweep → logo reveal → typographic event →
 * positioning line. Then (scroll-based): the camera pushes through the type into the
 * first production plate.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const plateSrc = services[0].image;

  useCinema(root, ({ gsap, ScrollTrigger, isMobile, add }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const html = document.documentElement;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    html.classList.add("intro-lock");
    lenisRef.current?.stop();

    // The camera push-through scene needs the pin from the very start so every later
    // pinned scene measures against the same layout.
    ScrollTrigger.create({ trigger: el, start: "top top", end: "+=170%", pin: pin.current, anticipatePin: 1 });

    const navLogo = document.querySelector<HTMLElement>(".nav-logo");
    const logoBox = q(".hero-logo-box");
    const logoImg = q(".hero-logo-img");
    const words = gsap.utils.toArray<HTMLElement>(q(".hero-type .hero-word"));
    const ghostWords = q(".is-ghost .hero-word");

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      html.classList.remove("intro-lock");
      lenisRef.current?.start();
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      ScrollTrigger.refresh();
    };

    const buildCameraMove = () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=170%", scrub: 0.9, invalidateOnRefresh: true },
      });
      tl.to(q(".hero-meta"), { opacity: 0, duration: 0.08 }, 0)
        .to(q(".hero-tag-inner"), { y: -70, opacity: 0, duration: 0.25 }, 0)
        .to(q(".hero-lines:not(.is-ghost)"), { scale: 3.1, opacity: 0, filter: "blur(14px)", duration: 0.62, ease: "power2.in" }, 0.04)
        .to(q(".is-ghost"), { scale: 3.8, opacity: 0, duration: 0.66, ease: "power2.in" }, 0.02)
        .to(q(".hero-fog"), { scale: 1.7, duration: 1 }, 0)
        .to(q(".hero-bloom"), { scale: 2.4, opacity: 0.9, duration: 0.5 }, 0.1)
        .fromTo(q(".hero-flash"), { opacity: 0 }, { opacity: 0.95, duration: 0.17 }, 0.36)
        .to(q(".hero-flash"), { opacity: 0, duration: 0.3 }, 0.53)
        .fromTo(
          q(".hero-plate"),
          { clipPath: "inset(47% 45% 47% 45%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.56, ease: "power2.inOut" },
          0.4,
        )
        .fromTo(q(".plate-img"), { scale: 1.8 }, { scale: 1.04, duration: 0.6, ease: "power2.out" }, 0.4);
    };

    const intro = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        release();
        add(buildCameraMove);
      },
    });

    // SCENE 01 — atmosphere wakes up
    intro.fromTo(q(".hero-fog"), { opacity: 0 }, { opacity: 1, duration: 2.4, ease: "power1.inOut" }, 0);

    // SCENE 02 — cinematic light sweeps across and reveals the composition
    intro
      .fromTo(q(".beam"), { x: "-80vw" }, { x: "140vw", duration: 2.9, ease: "power2.inOut" }, 0.5)
      .fromTo(q(".beam"), { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power1.out" }, 0.5)
      .to(q(".beam"), { opacity: 0, duration: 0.9, ease: "power1.in" }, 2.6)
      .fromTo(q(".hero-bloom"), { scale: 0.4, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 1.8, ease: "power2.out" }, 1.0);

    // SCENE 03 — logo reveal: masked wipe tracking the light, defocus → focus, then a highlight pass
    intro
      .fromTo(
        logoImg,
        { clipPath: "inset(0% 100% 0% 0%)", filter: "blur(18px)", opacity: 0, scale: 1.14 },
        { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", opacity: 1, scale: 1, duration: 2.1, ease: "power2.inOut" },
        1.0,
      )
      .fromTo(q(".logo-sweep"), { xPercent: -150, opacity: 0 }, { xPercent: 150, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 2.3)
      // …then the logo flies into the navigation slot.
      .to(
        logoBox,
        {
          x: () => {
            const a = (logoImg[0] as HTMLElement).getBoundingClientRect();
            const b = (navLogo?.querySelector("img") ?? navLogo)?.getBoundingClientRect();
            return b ? b.left + b.width / 2 - (a.left + a.width / 2) : 0;
          },
          y: () => {
            const a = (logoImg[0] as HTMLElement).getBoundingClientRect();
            const b = (navLogo?.querySelector("img") ?? navLogo)?.getBoundingClientRect();
            return b ? b.top + b.height / 2 - (a.top + a.height / 2) : -200;
          },
          scale: () => {
            const a = (logoImg[0] as HTMLElement).getBoundingClientRect();
            const b = (navLogo?.querySelector("img") ?? navLogo)?.getBoundingClientRect();
            return b ? b.width / a.width : 0.2;
          },
          duration: 1.5,
          ease: "power3.inOut",
        },
        3.5,
      )
      .add(() => {
        navLogo?.classList.add("is-ready");
        gsap.set(logoBox, { opacity: 0 });
      }, 5.0);

    // SCENE 04 — typographic event: layered split type, mask rise, tracking pull, defocus → focus
    words.forEach((word, i) => {
      const at = 3.9 + i * 0.42;
      intro
        .fromTo(
          word.querySelectorAll(".ch"),
          { yPercent: 118, rotate: 5, filter: "blur(14px)", opacity: 0 },
          { yPercent: 0, rotate: 0, filter: "blur(0px)", opacity: 1, duration: 1.3, ease: "expo.out", stagger: 0.045 },
          at,
        )
        .fromTo(word, { letterSpacing: "0.16em" }, { letterSpacing: "0em", duration: 1.9, ease: "power3.out" }, at);
    });
    intro.fromTo(ghostWords, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, 5.1);

    // SCENE 05 — brand positioning
    intro
      .fromTo(
        q(".hero-tag-inner"),
        { clipPath: "inset(0% 0% 100% 0%)", y: 26, opacity: 0, letterSpacing: "0.62em", filter: "blur(8px)" },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: 1, letterSpacing: "0.3em", filter: "blur(0px)", duration: 1.7 },
        5.5,
      )
      .fromTo(q(".hero-meta"), { opacity: 0 }, { opacity: 1, duration: 1 }, 6.5);

    // Skip: fast-forward gracefully instead of cutting.
    function skip() {
      if (intro.progress() < 1) intro.timeScale(6);
    }
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    q(".hero-skip")[0]?.addEventListener("click", skip);

    // LAYER 07 — pointer parallax (desktop only, subtle)
    const cleanup: Array<() => void> = [];
    if (fine && !isMobile) {
      const layers = gsap.utils.toArray<HTMLElement>(q(".hero-layer[data-depth]"));
      const rigs = layers.map((l) => ({
        d: parseFloat(l.dataset["depth"] ?? "0"),
        x: gsap.quickTo(l, "x", { duration: 1.5, ease: "power3" }),
        y: gsap.quickTo(l, "y", { duration: 1.5, ease: "power3" }),
      }));
      const flare = q(".hero-flare")[0] as HTMLElement | undefined;
      const fx = flare ? gsap.quickTo(flare, "x", { duration: 1.2, ease: "power3" }) : null;
      const fy = flare ? gsap.quickTo(flare, "y", { duration: 1.2, ease: "power3" }) : null;
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        rigs.forEach((r) => {
          r.x(nx * r.d * -26);
          r.y(ny * r.d * -16);
        });
        fx?.(e.clientX);
        fy?.(e.clientY);
      };
      window.addEventListener("pointermove", move, { passive: true });
      cleanup.push(() => window.removeEventListener("pointermove", move));
    }

    return () => {
      cleanup.forEach((c) => c());
      html.classList.remove("intro-lock");
      lenisRef.current?.start();
    };
  });

  return (
    <section id="top" ref={root} className="hero" data-scene="OPENING">
      <div ref={pin} className="hero-pin">
        <div className="hero-layer hero-bg" data-depth="0.3" />
        <div className="hero-layer hero-fog" data-depth="1">
          <Atmosphere />
        </div>
        <div className="hero-layer hero-beam" data-depth="1.4" aria-hidden="true">
          <span className="beam" />
        </div>
        <div className="hero-layer hero-glow" data-depth="1.2" aria-hidden="true">
          <span className="hero-bloom" />
        </div>

        <div className="hero-layer hero-ghost" data-depth="-1.6" aria-hidden="true">
          <Lines ghost />
          <p className="hero-tag is-spacer">
            <span className="hero-tag-inner">{TAG}</span>
          </p>
        </div>

        <div className="hero-layer hero-type" data-depth="2.6">
          <h1 className="hero-h1" aria-label="Innovate. Create. Elevate.">
            <Lines />
          </h1>
          <p className="hero-tag">
            <span className="hero-tag-inner">{TAG}</span>
          </p>
        </div>

        <div className="hero-layer hero-logo" data-depth="2">
          <div className="hero-logo-box">
            <img className="hero-logo-img" src={logo.url} alt="DW Production Media" decoding="async" fetchPriority="high" />
            <span className="logo-sweep" style={{ maskImage: `url(${logo.url})`, WebkitMaskImage: `url(${logo.url})` }} aria-hidden="true" />
          </div>
        </div>

        <span className="hero-flare" aria-hidden="true" />
        <div className="hero-plate" aria-hidden="true">
          <img className="plate-img" src={plateSrc} alt="" decoding="async" />
          <div className="plate-wash" />
        </div>
        <div className="hero-flash" aria-hidden="true" />

        <div className="hero-meta">
          <span>DW PRODUCTION MEDIA · DHAKA, BANGLADESH</span>
          <span className="hero-cue">SCROLL TO ENTER</span>
          <button type="button" className="hero-skip" data-cursor="link">
            SKIP INTRO
          </button>
        </div>
      </div>
    </section>
  );
}
