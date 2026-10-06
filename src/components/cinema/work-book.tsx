import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Mail, Phone, X } from "lucide-react";
import { bccaSlides, type BCCASlide } from "@/lib/bcca-slides";
import { ccaSlides } from "@/lib/cca-slides";
import type { Project } from "@/lib/studio";
import { Button } from "@/components/ui/button";

interface WorkBookProps {
  initialIndex?: number;
  projectIndex?: number;
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkBook({ initialIndex = 0, projectIndex, project, isOpen, onClose }: WorkBookProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [flippingGalleryIndex, setFlippingGalleryIndex] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const isCCA = (project ? project.title.startsWith("CCA") : (projectIndex === 1 || initialIndex === 1));
  const slides = isCCA ? ccaSlides : bccaSlides;

  useEffect(() => {
    if (isOpen) {
      setGalleryIndex(0);
      setIsAnimating(false);
      setFlippingGalleryIndex(null);
      setFlipDirection(null);
    }
  }, [isOpen, initialIndex, project]);

  const totalSlides = slides.length;
  const currentSlide: BCCASlide = slides[galleryIndex] ?? slides[0];

  const turnGalleryPage = useCallback(
    (targetIdx: number, direction: "next" | "prev") => {
      if (isAnimating || targetIdx < 0 || targetIdx >= totalSlides || targetIdx === galleryIndex) return;

      setIsAnimating(true);
      setFlippingGalleryIndex(galleryIndex);
      setFlipDirection(direction);

      setTimeout(() => {
        setGalleryIndex(targetIdx);
      }, 300);

      setTimeout(() => {
        setIsAnimating(false);
        setFlippingGalleryIndex(null);
        setFlipDirection(null);
      }, 650);
    },
    [galleryIndex, isAnimating, totalSlides],
  );

  const handleNext = useCallback(() => {
    if (galleryIndex < totalSlides - 1) {
      turnGalleryPage(galleryIndex + 1, "next");
    }
  }, [galleryIndex, totalSlides, turnGalleryPage]);

  const handlePrev = useCallback(() => {
    if (galleryIndex > 0) {
      turnGalleryPage(galleryIndex - 1, "prev");
    }
  }, [galleryIndex, turnGalleryPage]);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0]?.clientX ?? 0;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  if (!isOpen) return null;

  const isNextDisabled = isAnimating || galleryIndex === totalSlides - 1;
  const isPrevDisabled = isAnimating || galleryIndex === 0;

  return (
    <div className="workbook-overlay" role="dialog" aria-modal="true" aria-label="Official Work Book">
      <div className="workbook-backdrop" onClick={onClose} />

      <header className="workbook-header">
        <div className="workbook-brand">
          <BookOpen className="workbook-icon" size={16} />
          <span>DW PRODUCTION MEDIA · OFFICIAL WORK PROFILE</span>
        </div>
        <div className="workbook-counter">
          <span>SLIDE {String(galleryIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}</span>
          <small>{currentSlide.header}</small>
        </div>
        <Button
          variant="editorial"
          size="icon"
          className="workbook-close"
          onClick={onClose}
          aria-label="Close book view"
        >
          <X size={18} />
        </Button>
      </header>

      <div
        className="workbook-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrow Left */}
        <button
          type="button"
          className="workbook-nav workbook-nav-prev"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={28} />
        </button>

        {/* The 3D Book Object */}
        <div
          ref={bookRef}
          className={`workbook-book ${isAnimating ? "is-flipping" : ""}`}
        >
          <div className="workbook-spine-shadow" />
          <div className="workbook-paper-stack-left" />
          <div className="workbook-paper-stack-right" />

          {/* LEFT PAGE SPREAD */}
          <div
            className="workbook-page workbook-page-left"
            onClick={!isPrevDisabled ? handlePrev : undefined}
            title={!isPrevDisabled ? "Click to view previous slide" : undefined}
          >
            <div className="workbook-page-inner">
              {currentSlide.type === "image" && currentSlide.image ? (
                <div className="workbook-image-frame">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.header}
                    className="workbook-image"
                  />
                  <div className="workbook-image-caption">
                    <span>SLIDE {String(galleryIndex + 1).padStart(2, "0")}</span>
                    <span>2026</span>
                  </div>
                </div>
              ) : (
                <div className="workbook-text-spread">
                  <span className="slide-header-badge">OFFICIAL PRESENTATION SPREAD · SLIDE {String(galleryIndex + 1).padStart(2, "0")}</span>
                  <h2 className="slide-main-title">{currentSlide.header}</h2>
                  <p className="slide-subtitle">{currentSlide.subtitle}</p>

                  {currentSlide.sections && currentSlide.sections.slice(0, 2).map((sec, sIdx) => (
                    <div key={sec.title + sIdx} className="slide-section-box">
                      <h3>{sec.title}</h3>
                      <p>{sec.text}</p>
                    </div>
                  ))}

                  {currentSlide.type === "contact" && currentSlide.contactInfo && (
                    <div className="slide-section-box">
                      <h3>DW PRODUCTION MEDIA</h3>
                      <p>{currentSlide.contactInfo.subtitle}</p>
                    </div>
                  )}
                </div>
              )}

              <footer className="workbook-page-footer">
                <span>DW PRODUCTION MEDIA</span>
                <span>PAGE {String(galleryIndex * 2 + 1).padStart(2, "0")}</span>
              </footer>
            </div>
          </div>

          {/* RIGHT PAGE SPREAD */}
          <div
            className="workbook-page workbook-page-right"
            onClick={!isNextDisabled ? handleNext : undefined}
            title={!isNextDisabled ? "Click to view next slide" : undefined}
          >
            <div className="workbook-page-inner">
              <div className="workbook-content">
                <div className="workbook-eyebrow">
                  <span>{currentSlide.type.toUpperCase()} SPREAD</span>
                  <span className="workbook-year">2026</span>
                </div>

                {currentSlide.type === "image" ? (
                  <>
                    <h2 className="workbook-title">{currentSlide.header}</h2>
                    <div className="workbook-credit">{currentSlide.subtitle}</div>
                    <div className="workbook-divider" />

                    {currentSlide.highlights && (
                      <div className="workbook-highlights">
                        <h4>KEY PRESENTATION HIGHLIGHTS</h4>
                        <ul>
                          {currentSlide.highlights.map((hl, hIdx) => (
                            <li key={hIdx}>{hl}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : currentSlide.type === "contact" && currentSlide.contactInfo ? (
                  <>
                    <h2 className="workbook-title">{currentSlide.contactInfo.title}</h2>
                    <div className="workbook-credit">{currentSlide.contactInfo.subtitle}</div>
                    <div className="workbook-divider" />
                    <p className="workbook-description">{currentSlide.contactInfo.description}</p>

                    <div className="slide-contact-card">
                      <h3>{currentSlide.contactInfo.founder}</h3>
                      <div className="slide-contact-details">
                        <div><Phone size={14} className="inline mr-2" /> Phone: <strong>{currentSlide.contactInfo.phone}</strong></div>
                        <div><Mail size={14} className="inline mr-2" /> Email: <a href={`mailto:${currentSlide.contactInfo.email}`}>{currentSlide.contactInfo.email}</a></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {currentSlide.sections && currentSlide.sections.slice(2).map((sec, sIdx) => (
                      <div key={sec.title + sIdx} className="slide-section-box mb-3">
                        <h3>{sec.title}</h3>
                        <p>{sec.text}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* SLIDES SELECTOR STRIP */}
                <div className="workbook-page-gallery" onClick={(e) => e.stopPropagation()}>
                  <span>SLIDE SELECTION ({galleryIndex + 1} OF {totalSlides}):</span>
                  <div className="gallery-strip">
                    {slides.map((slide, sIdx) => (
                      <button
                        key={slide.id}
                        type="button"
                        className={`gallery-thumb ${galleryIndex === sIdx ? "is-active" : ""}`}
                        onClick={() => turnGalleryPage(sIdx, sIdx > galleryIndex ? "next" : "prev")}
                        title={`Jump to Slide ${sIdx + 1}: ${slide.header}`}
                      >
                        {slide.image ? (
                          <img src={slide.image} alt={`Slide ${sIdx + 1}`} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[9px] font-bold bg-muted text-muted-foreground">T-{sIdx + 1}</div>
                        )}
                        <span>{String(sIdx + 1).padStart(2, "0")}</span>
                      </button>
                    ))}
                  </div>
                </div>


              </div>

              <footer className="workbook-page-footer">
                <span>OFFICIAL PORTFOLIO SPREAD</span>
                <span>PAGE {String(galleryIndex * 2 + 2).padStart(2, "0")}</span>
              </footer>
            </div>
          </div>

          {/* FLIPPING PAGE (3D Turning Animation Layer) */}
          {isAnimating && flippingGalleryIndex !== null && flipDirection && (
            <div
              className={`workbook-flipping-page flip-${flipDirection}`}
            >
              <div className="workbook-flip-front">
                <div className="workbook-page-inner">
                  <div className="workbook-content">
                    <div className="workbook-eyebrow">
                      <span>SLIDE {String(flippingGalleryIndex + 1).padStart(2, "0")}</span>
                    </div>
                    <h2 className="workbook-title">{slides[flippingGalleryIndex]?.header}</h2>
                    <p className="workbook-description">{slides[flippingGalleryIndex]?.subtitle}</p>
                  </div>
                </div>
                <div className="workbook-flip-shadow" />
              </div>

              <div className="workbook-flip-back">
                <div className="workbook-page-inner">
                  <div className="workbook-content">
                    <div className="workbook-eyebrow">
                      <span>SLIDE {String(galleryIndex + 1).padStart(2, "0")}</span>
                    </div>
                    <h2 className="workbook-title">{slides[galleryIndex]?.header}</h2>
                    <p className="workbook-description">{slides[galleryIndex]?.subtitle}</p>
                  </div>
                </div>
                <div className="workbook-flip-shadow" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          className="workbook-nav workbook-nav-next"
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-label="Next Slide"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* FOOTER BAR WITH SLIDE THUMBNAILS & UPCOMING WORK BANNER */}
      <footer className="workbook-footer">
        <div className="workbook-thumbs" aria-label="Slide selection">
          {slides.map((slide, sIdx) => (
            <button
              key={slide.id}
              type="button"
              className={`workbook-thumb ${sIdx === galleryIndex ? "is-active" : ""}`}
              onClick={() => turnGalleryPage(sIdx, sIdx > galleryIndex ? "next" : "prev")}
              title={`Jump to Slide ${sIdx + 1}: ${slide.header}`}
            >
              {slide.image ? (
                <img src={slide.image} alt={slide.header} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[8px] font-bold bg-secondary text-foreground">SLIDE {sIdx + 1}</div>
              )}
              <span>0{sIdx + 1}</span>
            </button>
          ))}
        </div>


      </footer>
    </div>
  );
}
