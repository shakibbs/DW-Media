import { useRef } from "react";
import { Fog } from "@/components/atmosphere";
import { partners, processImages } from "@/lib/studio";
import { useCinema } from "./motion";

/** SCENE 02 — The Studio. A scroll-choreographed statement; the company is introduced without a card. */
export function Studio() {
  const root = useRef<HTMLElement>(null);

  useCinema(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: el, start: "top top", end: "+=280%", scrub: 0.8, pin: (q(".studio-pin")[0] as HTMLElement) ?? true },
    });

    // The statement assembles from scattered, defocused words.
    tl.fromTo(
      q(".sw"),
      {
        opacity: 0.05,
        filter: "blur(12px)",
        y: (i: number) => (i % 2 ? 110 : -110),
        x: (i: number) => (i - 3) * 70,
        letterSpacing: "0.12em",
      },
      { opacity: 1, filter: "blur(0px)", y: 0, x: 0, letterSpacing: "0em", stagger: 0.2, duration: 1.1 },
      0,
    );

    // Atmosphere shifts from ivory to cool pearl to warm champagne.
    tl.to(q(".studio-bg"), { backgroundColor: "#e9ebe7", duration: 1.6, ease: "none" }, 0.4)
      .to(q(".studio-bg"), { backgroundColor: "#efe3cb", duration: 1.6, ease: "none" }, 2.4);

    // Visual fragments emerge through masks.
    tl.fromTo(
      q(".frag"),
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.55, duration: 1.1 },
      0.5,
    );

    // Statement steps back; the company is introduced in open space.
    tl.to(q(".studio-statement"), { scale: 0.56, y: "-9vh", duration: 1.3, ease: "power3.inOut" }, 3.0)
      .fromTo(q(".studio-copy > *"), { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.18, duration: 1 }, 3.5)
      .to({}, { duration: 0.7 });

    // Fragments drift at different speeds across the whole scene.
    q(".frag").forEach((f, i) => {
      tl.fromTo(
        f.querySelector("img"),
        { yPercent: 14 + i * 4, scale: 1.25 },
        { yPercent: -14 - i * 4, scale: 1.05, duration: tl.duration(), ease: "none" },
        0,
      );
    });
  });

  return (
    <section id="studio" ref={root} className="studio" data-scene="THE STUDIO">
      <div className="studio-pin">
        <div className="studio-bg" />
        <Fog tone="warm" />
        <div className="studio-frags" aria-hidden="true">
          <figure className="frag f1">
            <img src={processImages[0]} alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className="frag f2">
            <img src={processImages[2]} alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className="frag f3">
            <img src={processImages[3]} alt="" loading="lazy" decoding="async" />
          </figure>
        </div>
        <h2 className="studio-statement" aria-label="We turn ideas into visual experiences.">
          <span className="sline" aria-hidden="true">
            <span className="sw">WE</span> <span className="sw">TURN</span> <em className="sw">IDEAS</em>
          </span>
          <span className="sline" aria-hidden="true">
            <span className="sw">INTO</span> <span className="sw">VISUAL</span>
          </span>
          <span className="sline" aria-hidden="true">
            <em className="sw">EXPERIENCES.</em>
          </span>
        </h2>
        <div className="studio-copy">
          <p className="eyebrow">02 — THE STUDIO</p>
          <p className="studio-lead">
            <strong>We are DW Production Media.</strong> A new-generation media and entertainment initiative bringing
            together creative production, brand experiences and digital culture.
          </p>
          <p className="studio-body">
            Our independent vision is supported by experienced collaborators in fashion, production and entertainment
            media. Together, we connect ideas, talent and brands — with thoughtful planning and purposeful execution.
          </p>
          <p className="studio-partners">
            <span>IN ASSOCIATION WITH</span>
            {partners.map((p) => (
              <b key={p}>{p}</b>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
