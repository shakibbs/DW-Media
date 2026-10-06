import { useEffect, useRef } from "react";

/**
 * Volumetric daylight canvas: drifting multi-depth fog banks, soft shadow
 * pockets, slow light rays and floating dust. Rendered at low resolution and
 * scaled up (the softness is the point) at ~30fps. Pointer position shifts the
 * light source; touch / small screens get fewer particles and no pointer link.
 */
export function Atmosphere({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const W = small ? 360 : 640;
    const H = small ? 640 : 400;
    canvas.width = W;
    canvas.height = H;

    const dust = Array.from({ length: small ? 18 : 46 }, (_, i) => ({
      x: (i * 137.508) % W,
      y: (i * 89.31) % H,
      z: 0.3 + ((i * 53) % 100) / 100,
      s: 0.5 + ((i * 29) % 10) / 10,
    }));

    let frame = 0;
    let last = 0;
    let time = 0;
    let px = 0;
    let tx = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    const draw = () => {
      px += (tx - px) * 0.04;
      ctx.globalCompositeOperation = "source-over";
      const base = ctx.createLinearGradient(0, 0, W, H);
      base.addColorStop(0, "#faf6ec");
      base.addColorStop(0.55, "#f2ecdf");
      base.addColorStop(1, "#e6e0d2");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      // Shadow pockets (depth) — slow, wide, warm grey.
      for (let i = 0; i < 4; i++) {
        const x = W * (0.15 + i * 0.27) + Math.sin(time * 0.35 + i * 2.1) * 60 - px * 30 * (1 + i * 0.2);
        const y = H * (0.72 + Math.sin(time * 0.3 + i) * 0.1);
        const g = ctx.createRadialGradient(x, y, 0, x, y, W * 0.34);
        g.addColorStop(0, "rgba(120,108,86,0.13)");
        g.addColorStop(1, "rgba(120,108,86,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // Fog banks — three depth layers moving at different speeds.
      for (let layer = 0; layer < 3; layer++) {
        const speed = 0.18 + layer * 0.14;
        const count = small ? 5 : 8;
        for (let i = 0; i < count; i++) {
          const phase = i / count;
          const x = ((phase * W * 1.5 + time * 22 * speed * (layer + 1) - layer * 80) % (W * 1.5)) - W * 0.25 - px * (20 + layer * 26);
          const y = H * (0.25 + layer * 0.22) + Math.sin(time * 0.5 + i * 1.7 + layer) * 34;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(2.2, 0.62);
          const r = 110 + layer * 28;
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
          g.addColorStop(0, `rgba(255,253,247,${0.5 - layer * 0.1})`);
          g.addColorStop(1, "rgba(255,253,247,0)");
          ctx.fillStyle = g;
          ctx.fillRect(-r, -r, r * 2, r * 2);
          ctx.restore();
        }
      }

      // Slow light rays from the upper right, tilting with the pointer.
      const rx = W * 0.78 + px * 70;
      for (let i = 0; i < 3; i++) {
        const spread = 40 + i * 46;
        const g = ctx.createLinearGradient(rx, 0, rx - 200, H);
        g.addColorStop(0, `rgba(255,244,214,${0.34 - i * 0.08})`);
        g.addColorStop(1, "rgba(255,244,214,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(rx + Math.sin(time * 0.4 + i) * 16, 0);
        ctx.lineTo(rx + spread + Math.sin(time * 0.4 + i) * 16, 0);
        ctx.lineTo(rx - 160 - spread, H);
        ctx.lineTo(rx - 330 - spread * 0.4, H);
        ctx.fill();
      }

      // Dust motes.
      for (const d of dust) {
        const x = (d.x + Math.sin(time * 0.6 * d.z + d.y) * 10 - px * 40 * d.z + W) % W;
        const y = (d.y - time * 6 * d.z + H * 4) % H;
        ctx.fillStyle = d.s > 1 ? "rgba(255,255,255,0.85)" : "rgba(110,96,70,0.28)";
        ctx.fillRect(x, y, d.s * d.z + 0.4, d.s * d.z + 0.4);
      }
    };

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (now - last < 33) return;
      last = now;
      if (!paused && !reduced.matches) time += 0.033;
      draw();
    };
    draw();
    if (!reduced.matches) frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [paused]);

  return <canvas ref={ref} className="atmosphere-canvas" aria-hidden="true" />;
}

/** Cheap CSS-only atmosphere for the sections after the hero. */
export function Fog({ tone = "light" }: { tone?: "light" | "warm" | "cool" }) {
  return (
    <div className={`fog fog-${tone}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}