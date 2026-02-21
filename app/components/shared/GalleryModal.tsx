"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getImageUrl = (img: string | { url: string }) => {
    return typeof img === "string" ? img : img.url;
  };

  const getSmartCaption = (
    img: string | { url: string; caption?: string },
    index: number,
  ) => {
    const userCaption = typeof img === "string" ? "" : img.caption;
    if (userCaption) return userCaption;

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  useEffect(() => {
    if (images.length > 1) {
      const activeThumb = document.querySelector(".thumb-btn-active");
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex, images.length]);

  if (!mounted || !isOpen || !images || images.length === 0) return null;

  const currentImage = images[activeIndex];
  if (!currentImage) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-[var(--background)]/95 backdrop-blur-[20px] z-[9999] flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      {/* Blurred Backdrop Image */}
      <div className="absolute -inset-5 z-[-1] overflow-hidden opacity-40 blur-[40px] brightness-[0.7]">
        <img
          src={getImageUrl(currentImage)}
          alt=""
          className="w-full h-full object-cover scale-110"
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-[10003]">
        <div
          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] shadow-[0_0_10px_var(--primary)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: `${((activeIndex + 1) / images.length) * 100}%` }}
        ></div>
      </div>

      <div className="absolute top-0 left-0 w-full p-5 md:px-[30px] md:py-5 flex justify-end items-center gap-4 z-[10001] bg-gradient-to-b from-black/60 to-transparent">
        <div className="bg-black/60 backdrop-blur-[10px] px-3.5 py-1.5 rounded text-sm font-bold text-[var(--primary)] mr-auto border border-[var(--primary)] shadow-[0_0_10px_var(--primary)]">
          {activeIndex + 1} / {images.length}
        </div>

        <button
          className="w-11 h-11 rounded-full bg-[var(--primary)]/10 border border-[var(--accent)] text-[var(--accent)] flex items-center justify-center transition-all duration-300 hover:bg-[var(--accent)]/20 hover:shadow-[0_0_20px_var(--accent)] hover:rotate-90 hover:scale-110 cursor-pointer shadow-[0_0_5px_var(--accent)]"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>

      <div
        className="relative w-[95%] max-w-[1400px] h-screen pt-[60px] flex flex-col items-center justify-center gap-5"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        <div className="flex-1 w-full flex items-center justify-center gap-6 min-h-0">
          <button
            className="hidden md:flex bg-black/50 border border-[var(--primary)] text-[var(--primary)] w-14 h-14 rounded-full items-center justify-center transition-all duration-300 hover:bg-[var(--primary)]/20 hover:scale-110 hover:shadow-[0_0_20px_var(--primary)] hover:text-white cursor-pointer backdrop-blur-sm shadow-lg disabled:opacity-10 disabled:cursor-not-allowed disabled:transform-none shrink-0"
            onClick={handlePrev}
            disabled={images.length <= 1}
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative w-full max-w-[1100px] aspect-video max-h-[70vh] flex items-center justify-center bg-black/60 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.2),0_0_40px_rgba(0,243,255,0.1),inset_0_0_15px_rgba(0,243,255,0.1)] border border-cyan-400/60 transition-all sm:aspect-video aspect-[4/3] sm:w-full w-[94%] mx-auto sm:max-h-[70vh] max-h-[50vh] sm:rounded-lg rounded-xl sm:border-cyan-400/60 shadow-lg"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Tech Corner Accents */}
            <div className="absolute inset-0 pointer-events-none border-2 border-transparent bg-[linear-gradient(45deg,var(--primary)_0%,transparent_20%)_top_left/100%_100%_no-repeat,linear-gradient(-135deg,var(--primary)_0%,transparent_20%)_bottom_right/100%_100%_no-repeat] opacity-50 z-[5]"></div>

            {/* Holographic Scanline */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent z-[6] opacity-30 animate-[scanline_4s_linear_infinite] pointer-events-none"></div>

            <img
              key={activeIndex}
              src={getImageUrl(currentImage)}
              alt={`Property image ${activeIndex + 1}`}
              className="w-full h-full object-cover z-[2] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-fit max-w-[80%] sm:max-w-fit sm:w-fit w-[90%] bg-gradient-to-br from-[var(--primary)]/5 to-[var(--background)]/70 backdrop-blur-[25px] saturate-[160%] px-8 py-3 rounded-xl border border-[var(--primary)]/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] z-10 flex flex-col items-center text-center gap-0.5 animate-[auroraFloat_0.7s_cubic-bezier(0.2,0.8,0.2,1)_forwards] before:content-[''] before:absolute before:left-0 before:top-[20%] before:h-[60%] before:w-1 before:bg-[var(--primary)] before:rounded-r-md sm:py-3 sm:px-8 py-2.5 px-5">
              <h3 className="text-[1.1rem] sm:text-[1.1rem] text-sm font-bold text-white tracking-wide">
                {getSmartCaption(currentImage, activeIndex)}
              </h3>
              {title && (
                <span className="text-xs sm:text-[0.8rem] text-[var(--primary)] font-medium tracking-[1.2px] uppercase opacity-90">
                  {title}
                </span>
              )}
            </div>
          </div>

          <button
            className="hidden md:flex bg-black/50 border border-cyan-400 text-cyan-400 w-14 h-14 rounded-full items-center justify-center transition-all duration-300 hover:bg-cyan-400/20 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] hover:text-white cursor-pointer backdrop-blur-sm shadow-lg disabled:opacity-10 disabled:cursor-not-allowed disabled:transform-none shrink-0"
            onClick={handleNext}
            disabled={images.length <= 1}
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {images.length > 1 && (
          <div className="h-[70px] w-full max-w-[600px] sm:max-w-[600px] max-w-[400px] flex justify-start sm:justify-center items-center gap-2.5 overflow-x-auto p-2 bg-black/40 rounded-[40px] backdrop-blur-[10px] border border-white/10 mb-5 scrollbar-hide absolute bottom-5 sm:relative sm:bottom-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`flex-none w-[70px] sm:w-[70px] w-[50px] h-full sm:h-full h-[50px] rounded-lg sm:rounded-lg rounded-full overflow-hidden cursor-pointer transition-all duration-300 border-2 bg-transparent opacity-50 hover:opacity-80 hover:-translate-y-0.5 ${
                  idx === activeIndex
                    ? "opacity-100 border-[var(--primary)] scale-110 shadow-[0_0_15px_var(--primary)] thumb-btn-active"
                    : "border-transparent"
                }`}
                onClick={() => setActiveIndex(idx)}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(1000%);
            opacity: 0;
          }
        }
        @keyframes auroraFloat {
          from {
            opacity: 0;
            transform: translate(-50%, 40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>,
    document.body,
  );
}
