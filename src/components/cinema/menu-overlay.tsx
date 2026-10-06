import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact, navLinks } from "@/lib/studio";
import { pad, scrollToTarget } from "./motion";

const ease = [0.76, 0, 0.24, 1] as const;

export default function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (target: string) => {
    onClose();
    window.setTimeout(() => scrollToTarget(target), 650);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-overlay"
          className="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
          transition={{ duration: 0.85, ease }}
        >
          <div className="menu-preview" aria-hidden="true">
            {navLinks.map((l, i) => (
              <motion.img
                key={l.label}
                src={l.image}
                alt=""
                decoding="async"
                animate={{ opacity: hover === i ? 1 : 0, scale: hover === i ? 1 : 1.12 }}
                transition={{ duration: 0.8, ease }}
              />
            ))}
          </div>
          <nav className="menu-links" aria-label="Primary">
            {navLinks.map((l, i) => (
              <div className="menu-row" key={l.label}>
                <motion.a
                  href={l.target}
                  className="menu-link"
                  data-cursor="link"
                  data-dim={hover !== null && hover !== i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.target);
                  }}
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-115%" }}
                  transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.07 }}
                >
                  <small>{pad(i + 1)}</small>
                  {l.label.toUpperCase()}
                </motion.a>
              </div>
            ))}
          </nav>
          <motion.div
            className="menu-foot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={contact.phoneHref}>{contact.phone}</a>
            <span>INNOVATE. CREATE. ELEVATE.</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
