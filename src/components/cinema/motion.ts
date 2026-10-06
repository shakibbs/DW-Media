import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { useLayoutEffect, type RefObject } from "react";

let registered = false;

export function setupGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** The active Lenis instance (null when reduced-motion or before mount). */
export const lenisRef: { current: Lenis | null } = { current: null };

export const pad = (n: number) => String(n).padStart(2, "0");

export function scrollToTarget(target: string | number | HTMLElement) {
  const lenis = lenisRef.current;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.9, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}

export type CinemaContext = {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  isMobile: boolean;
  /** Register animations created after setup returns (e.g. in callbacks) so they get reverted. */
  add: (fn: () => void) => void;
};

/**
 * Runs `setup` inside a gsap.context + matchMedia. Nothing runs when the visitor
 * prefers reduced motion — the CSS default state is the readable, static final state.
 */
export function useCinema(
  scope: RefObject<HTMLElement | null>,
  setup: (c: CinemaContext) => void | (() => void),
) {
  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 768px)" },
        (c) => {
          const cond = (c.conditions ?? {}) as Record<string, boolean>;
          if (!cond["motion"]) return;
          return setup({
            gsap,
            ScrollTrigger,
            isMobile: !!cond["mobile"],
            add: (fn) => c.add(fn),
          });
        },
      );
    }, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Pin height used by every pinned scene. */
export const PIN_END = (percent: number) => `+=${percent}%`;
