"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
  emptyMessage?: string;
}

export default function HorizontalCarousel({
  title,
  children,
  emptyMessage,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const childrenArray = React.Children.toArray(children);
  const hasItems = childrenArray.length > 0;

  const scroll = (direction: "left" | "right") => {
    if (!ref.current) return;
    const scrollAmount = ref.current.offsetWidth * 0.9;
    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!hasItems) return null;

  return (
    <div className="relative w-full flex flex-col items-center mb-0 before:content-[''] before:absolute before:top-1/4 before:left-1/2 before:-translate-x-1/2 before:w-[60%] before:h-[300px] before:bg-[radial-gradient(circle,rgba(var(--primary),0.05)_0%,transparent_70%)] before:pointer-events-none before:-z-10">
      <div className="w-full max-w-[1400px] px-5 flex flex-col items-center text-center mb-1">
        <h2 className="font-['Outfit'] text-[1.2rem] md:text-[1.8rem] font-extrabold m-0 mb-1 uppercase tracking-[1.5px] bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--secondary)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shine_5s_linear_infinite] whitespace-nowrap">
          {title}
        </h2>
        <div className="flex items-center justify-center gap-[15px] w-full mb-1.5">
          <div className="h-[2px] flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60"></div>
          <div className="w-2 h-2 bg-[var(--primary)] rounded-full shadow-[0_0_15px_var(--primary)]"></div>
          <div className="h-[2px] flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60"></div>
        </div>
      </div>

      <div className="relative w-full max-w-[95%] mx-auto px-[2%]">
        {hasItems && (
          <button
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-1 md:left-2 z-[60] w-9 h-9 md:w-11 md:h-11 rounded-full items-center justify-center transition-all duration-400 cursor-pointer bg-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] border-2 border-white/30 text-white hover:scale-110 hover:bg-[var(--secondary)] active:scale-95"
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" strokeWidth={4} />
          </button>
        )}

        <div
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth py-1 px-2.5 pb-6 scroll-snap-x scrollbar-hide select-none touch-pan-x"
          ref={ref}
        >
          {hasItems ? (
            childrenArray.map((child, index) => (
              <div
                key={index}
                className="flex-none w-[297px] md:w-[400px] lg:w-[400px] sm:w-[297px] scroll-snap-start transition-transform duration-300"
              >
                {child}
              </div>
            ))
          ) : (
            <p className="w-full text-center text-[var(--muted)] italic p-10">
              {emptyMessage}
            </p>
          )}
        </div>

        {hasItems && (
          <button
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-1 md:right-2 z-[60] w-9 h-9 md:w-11 md:h-11 rounded-full items-center justify-center transition-all duration-400 cursor-pointer bg-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] border-2 border-white/30 text-white hover:scale-110 hover:bg-[var(--secondary)] active:scale-95"
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7" strokeWidth={4} />
          </button>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
}
