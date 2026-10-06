import { useEffect, useRef } from "react";
import { pad, setupGsap } from "./motion";

/** Fixed "SCENE 03 / 08" slate + a thin film-progress line, driven by ScrollTrigger. */
export function SceneIndicator() {
  const num = useRef<HTMLElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
    const total = scenes.length;
    const triggers: ScrollTrigger[] = [];

    scenes.forEach((section, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            if (num.current) num.current.textContent = pad(i + 1);
            if (name.current) name.current.textContent = section.dataset["scene"] ?? "";
          },
        }),
      );
    });

    if (!reduce && bar.current) {
      gsap.set(bar.current, { scaleX: 0, transformOrigin: "0 50%" });
      triggers.push(
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => bar.current && gsap.set(bar.current, { scaleX: self.progress }),
        }),
      );
    }
    const t = total;
    if (t === 0 && num.current) num.current.textContent = "01";
    return () => triggers.forEach((s) => s.kill());
  }, []);

  return (
    <>
      <div className="scene-progress" aria-hidden="true">
        <div ref={bar} />
      </div>
      <p className="scene-tag" aria-hidden="true">
        <span>SCENE </span>
        <b ref={num}>01</b>
        <span className="scene-sep"> — </span>
        <span ref={name}>OPENING</span>
      </p>
    </>
  );
}
