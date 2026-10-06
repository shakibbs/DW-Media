import { lazy, Suspense, useEffect, useState } from "react";
import logo from "@/assets/dw-mark.asset.json";
import { scrollToTarget } from "./motion";

const MenuOverlay = lazy(() => import("./menu-overlay"));

/** Minimal floating navigation: logo on one side, menu trigger on the other. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const toggle = () => {
    setEverOpened(true);
    setOpen((v) => !v);
  };

  return (
    <>
      <header className="nav">
        <a
          href="#top"
          className="nav-logo"
          aria-label="DW Production Media — back to the opening"
          data-cursor="link"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            scrollToTarget(0);
          }}
        >
          <img src={logo.url} alt="DW Production Media" decoding="async" />
        </a>
        <button
          type="button"
          className="nav-menu"
          aria-expanded={open}
          aria-controls="menu-overlay"
          data-cursor="link"
          onClick={toggle}
        >
          <span className="nav-menu-label">{open ? "CLOSE" : "MENU"}</span>
          <span className="nav-burger" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>
      {everOpened && (
        <Suspense fallback={null}>
          <MenuOverlay open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
