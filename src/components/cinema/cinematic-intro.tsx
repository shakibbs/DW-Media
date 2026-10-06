import { useEffect, useRef, useState } from "react";
import logo from "@/assets/dw-mark.asset.json";
import { Atmosphere } from "@/components/atmosphere";
import { setupGsap } from "./motion";

export interface CinematicIntroProps {
  /** Optional callback fired when the intro sequence finishes revealing the hero */
  onComplete?: () => void;
  /** Duration of the logo reveal phase in seconds. Default: 1.4 */
  revealDuration?: number;
  /** Duration of the cinematic pause before transition starts in seconds. Default: 1.3 */
  pauseDuration?: number;
  /** Duration of the upward slide transition in seconds. Default: 1.2 */
  liftDuration?: number;
  /** Custom logo URL if different from default asset */
  logoUrl?: string;
  /** Company title displayed in editorial typography */
  title?: string;
  /** Subtitle / positioning tag */
  subtitle?: string;
}

export function CinematicIntro({
  onComplete,
  revealDuration = 1.4,
  pauseDuration = 1.3,
  liftDuration = 1.2,
  logoUrl = logo.url,
  title = "DW PRODUCTION MEDIA",
  subtitle = "FILM · BRANDING · CREATIVE PRODUCTION",
}: CinematicIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const { gsap } = setupGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;

    // Lock scrolling while the intro curtain is active
    html.classList.add("intro-active");
    const preventScroll = (e: Event) => e.preventDefault();
    window.addEventListener("touchmove", preventScroll, { passive: false });

    const rootEl = rootRef.current;
    const panelEl = panelRef.current;
    if (!rootEl || !panelEl) return;

    if (reduce) {
      // Reduced motion fallback: quick subtle fade out
      const timer = setTimeout(() => {
        gsap.to(rootEl, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setCompleted(true);
            html.classList.remove("intro-active");
            window.removeEventListener("touchmove", preventScroll);
            onComplete?.();
          },
        });
      }, 1200);
      return () => {
        clearTimeout(timer);
        html.classList.remove("intro-active");
        window.removeEventListener("touchmove", preventScroll);
      };
    }

    // GSAP Timeline for the 3-Scene Intro Sequence
    const tl = gsap.timeline({
      onComplete: () => {
        setCompleted(true);
        html.classList.remove("intro-active");
        window.removeEventListener("touchmove", preventScroll);
        onComplete?.();
      },
    });

    // Initial state setup
    gsap.set(panelEl, { yPercent: 0 });
    gsap.set(bloomRef.current, { opacity: 0, scale: 0.6 });
    gsap.set(logoBoxRef.current, { opacity: 0, filter: "blur(20px)", scale: 0.92 });
    gsap.set(logoImgRef.current, { opacity: 0, filter: "blur(16px)", scale: 0.94 });
    gsap.set(titleRef.current, { opacity: 0, y: 18, filter: "blur(10px)", letterSpacing: "0.4em" });
    gsap.set(tagRef.current, { opacity: 0, y: 12, filter: "blur(8px)", letterSpacing: "0.5em" });
    gsap.set(lineTopRef.current, { scaleX: 0 });
    gsap.set(lineBottomRef.current, { scaleX: 0 });
    gsap.set(sweepRef.current, { xPercent: -150, opacity: 0 });

    // --- PHASE 1: BRAND REVEAL (0s -> revealDuration) ---
    // 1. Soft atmospheric bloom light expands
    tl.to(
      bloomRef.current,
      {
        opacity: 0.85,
        scale: 1.15,
        duration: revealDuration * 1.1,
        ease: "power2.out",
      },
      0,
    );

    // 2. Framing accent lines expand horizontally
    tl.to(
      [lineTopRef.current, lineBottomRef.current],
      {
        scaleX: 1,
        duration: revealDuration * 0.9,
        ease: "expo.out",
        stagger: 0.1,
      },
      0.2,
    );

    // 3. Logo container & image emerge (Defocus -> Focus + Scale + Opacity)
    tl.to(
      logoBoxRef.current,
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: revealDuration,
        ease: "power3.out",
      },
      0.3,
    );

    tl.to(
      logoImgRef.current,
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: revealDuration,
        ease: "power3.out",
      },
      0.3,
    );

    // 4. Light sweep across the logo emblem
    if (sweepRef.current) {
      tl.fromTo(
        sweepRef.current,
        { xPercent: -150, opacity: 0 },
        {
          xPercent: 150,
          opacity: 0.8,
          duration: revealDuration * 0.9,
          ease: "power2.inOut",
        },
        0.5,
      );
    }

    // 5. Editorial Title typography reveals
    tl.to(
      titleRef.current,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        letterSpacing: "0.22em",
        duration: revealDuration * 0.8,
        ease: "power3.out",
      },
      0.5,
    );

    // 6. Subtitle tag reveals
    tl.to(
      tagRef.current,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        letterSpacing: "0.3em",
        duration: revealDuration * 0.7,
        ease: "power3.out",
      },
      0.7,
    );

    // --- PHASE 2: CINEMATIC PAUSE (Hold for pauseDuration) ---
    // Subtle breathing scale/glow during hold
    tl.to(
      logoBoxRef.current,
      {
        scale: 1.025,
        duration: pauseDuration,
        ease: "sine.inOut",
      },
      revealDuration,
    );

    // --- PHASE 3: AUTOMATIC CINEMATIC CURTAIN LIFT (liftDuration) ---
    const liftStartTime = revealDuration + pauseDuration;

    // Upward slide of the full opening panel
    tl.to(
      panelEl,
      {
        yPercent: -100,
        duration: liftDuration,
        ease: "cubic-bezier(0.76, 0, 0.24, 1)", // Premium cinematic ease
      },
      liftStartTime,
    );

    // Subtle atmospheric motion blur / fade during the upward lift
    tl.to(
      [logoBoxRef.current, titleRef.current, tagRef.current],
      {
        y: -40,
        opacity: 0.7,
        filter: "blur(6px)",
        duration: liftDuration * 0.7,
        ease: "power2.in",
      },
      liftStartTime,
    );

    return () => {
      tl.kill();
      html.classList.remove("intro-active");
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [onComplete, revealDuration, pauseDuration, liftDuration]);

  if (completed) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="cinematic-intro-root"
      aria-label="Brand introduction"
      role="region"
    >
      <div ref={panelRef} className="cinematic-intro-panel">
        {/* Living atmospheric canvas background */}
        <div className="cinematic-intro-atmosphere">
          <Atmosphere />
        </div>

        {/* Soft volumetric light bloom */}
        <div ref={bloomRef} className="cinematic-intro-bloom" aria-hidden="true" />

        {/* Film grain texture overlay */}
        <div className="cinematic-intro-grain" aria-hidden="true" />

        {/* Framing accent lines */}
        <div ref={lineTopRef} className="cinematic-intro-line line-top" aria-hidden="true" />
        <div ref={lineBottomRef} className="cinematic-intro-line line-bottom" aria-hidden="true" />

        {/* Main Brand Ident Content Container */}
        <div className="cinematic-intro-content">
          <div ref={logoBoxRef} className="cinematic-intro-logo-box">
            <img
              ref={logoImgRef}
              src={logoUrl}
              alt="DW Production Media Logo"
              className="cinematic-intro-logo-img"
              decoding="async"
              fetchPriority="high"
            />
            <span ref={sweepRef} className="cinematic-intro-sweep" aria-hidden="true" />
          </div>

          <h1 ref={titleRef} className="cinematic-intro-title">
            {title}
          </h1>

          <p ref={tagRef} className="cinematic-intro-tag">
            {subtitle}
          </p>

          <div className="cinematic-intro-slate">
            <span>DHAKA, BANGLADESH</span>
            <span className="dot">•</span>
            <span>CINEMATIC MEDIA HOUSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
