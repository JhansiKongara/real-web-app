"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/app/styles/HorizontalCarousel.scss";

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

  // Convert children to array to check length accurately
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

  // Strictly hide the entire block if no items are available
  if (!hasItems) return null;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="attractive-title">{title}</h2>
        <div className="title-separator">
          <div className="line"></div>
          <div className="glow-dot"></div>
          <div className="line"></div>
        </div>
      </div>

      <div className="carousel-wrapper">
        {hasItems && (
          <button
            className="arrow left"
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
        )}

        <div className="plots-grid" ref={ref}>
          {hasItems ? children : <p className="empty-msg">{emptyMessage}</p>}
        </div>

        {hasItems && (
          <button
            className="arrow right"
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}
