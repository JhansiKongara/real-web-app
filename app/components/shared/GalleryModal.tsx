"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "@/app/styles/GalleryModal.scss";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | { url: string; caption?: string })[];
  title?: string;
}

export default function GalleryModal({
  isOpen,
  onClose,
  images,
  title,
}: GalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe handling refs
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  // Auto-play state & ref - DELETED as requested
  // const [isPlaying, setIsPlaying] = useState(false);
  // const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // --- Helper Functions ---
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  /* const togglePlay = () => setIsPlaying(!isPlaying); */ // REMOVED

  const getImageUrl = (img: string | { url: string }) => {
    return typeof img === "string" ? img : img.url;
  };

  const getCaption = (img: string | { url: string; caption?: string }) => {
    return typeof img === "string" ? "" : img.caption || "";
  };

  const getSmartCaption = (
    img: string | { url: string; caption?: string },
    index: number,
  ) => {
    const userCaption = typeof img === "string" ? "" : img.caption;
    if (userCaption) return userCaption;

    // Smart default captions
    if (index === 0) return "Property Front View";
    if (index === 1) return "Spacious Living Area";
    if (index === 2) return "Master Bedroom";
    if (index === 3) return "Modern Kitchen";
    if (index === 4) return "Restroom / Bath";

    return `${title || "Property"} - View ${index + 1}`;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  // --- Effects ---

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]); // Depend on isOpen. activeIndex dependency removed to avoid stale closures if using functional updates, but handleNext uses state.
  // Actually handleNext uses functional update `setActiveIndex(prev => ...)` so it doesn't need activeIndex dependency.
  // But wait, `handleNext` is recreated every render? No, it's a const function.
  // It captures `images` from scope. `images` should be in dependency but it's a prop.

  // We should strictly wrap `handleNext` in useCallback or just list it.
  // For simplicity, listing `isPlaying` is "okay" if we accept effect re-running on every render if handleNext changes... wait.
  // If `handleNext` changes every render, and we add it to dep array, interval resets every 3s? No, every render.
  // That would break the interval.

  // FIX: We need `handleNext` to be stable or use a ref for the callback.
  // Or just rely on the functional update and `images.length` being stable-ish.
  // Since `images` comes from parent, it might be new reference every time.
  // Let's use `activeIndex` in the effect?
  // actually the previous code had `[isPlaying, activeIndex]`.
  // That means it resets the specific interval on every slide change. That is actually DESIRED behavior for slideshows (wait 3s after *this* slide).

  // Smart Thumbnail Auto-scroll
  useEffect(() => {
    if (images.length > 1) {
      const activeThumb = document.querySelector(".thumb-btn.active");
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  // --- Render Guards ---
  if (!isOpen) return null;
  if (!images || images.length === 0) return null;

  const currentImage = images[activeIndex];
  if (!currentImage) return null;

  return (
    <div
      className={`gallery-modal-overlay ${isOpen ? "is-open" : ""}`}
      onClick={onClose}
    >
      {/* Blurred Backdrop Image */}
      <div className="gallery-backdrop-blur">
        <img src={getImageUrl(currentImage)} alt="" />
      </div>

      <div className="top-progress-indicator">
        <div
          className="progress-fill"
          style={{ width: `${((activeIndex + 1) / images.length) * 100}%` }}
        ></div>
      </div>

      <div className="top-controls">
        <div className="image-counter-badge">
          {activeIndex + 1} / {images.length}
        </div>

        <button className="icon-btn close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div
        className="gallery-container"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        <div className="main-content-area">
          <button
            className="nav-btn prev"
            onClick={handlePrev}
            disabled={images.length <= 1}
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="modern-image-wrapper"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              key={activeIndex} // Triggers animation on change
              src={getImageUrl(currentImage)}
              alt={`Property image ${activeIndex + 1}`}
              className="main-image"
            />

            <div className="smart-caption-overlay">
              <h3>{getSmartCaption(currentImage, activeIndex)}</h3>
              {title && <span className="sub-caption">{title}</span>}
            </div>
          </div>

          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={images.length <= 1}
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {images.length > 1 && (
          <div className="thumbnails-strip">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${idx === activeIndex ? "active" : ""}`}
                onClick={() => {
                  setActiveIndex(idx);
                }}
              >
                <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} />
                {/* Progress bar for active item if playing? maybe too much detail for now */}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
