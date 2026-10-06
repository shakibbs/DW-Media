import { useEffect, useRef } from "react";
import { setupGsap } from "./motion";

/** Custom cursor for fine pointers. Elements opt in with data-cursor="view|play|link" and data-cursor-label. */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = root.current;
    if (!el) return;
    const { gsap } = setupGsap();
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    gsap.set(el, { xPercent: -50, yPercent: -50 });

    const move = (e: PointerEvent) => {
      el.classList.add("is-on");
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const state = target?.dataset["cursor"] ?? "";
      el.dataset["state"] = state;
      if (label.current) label.current.textContent = target?.dataset["cursorLabel"] ?? state.toUpperCase();
    };
    const leave = () => el.classList.remove("is-on");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <span className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </span>
      <span className="cursor-dot" />
    </div>
  );
}
