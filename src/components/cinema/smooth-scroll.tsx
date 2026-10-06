import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { lenisRef, setupGsap } from "./motion";

/** Smooth, inertial scrolling wired into ScrollTrigger. Disabled for reduced-motion. */
export function SmoothScroll() {
  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick: ((time: number) => void) | null = null;
    let lenis: Lenis | null = null;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const l = lenis;
      tick = (time) => l.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
