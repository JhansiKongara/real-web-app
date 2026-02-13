"use client";

import { useRef } from "react";

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

  const scroll = (direction: "left" | "right") => {
    if (!ref.current) return;

    const scrollAmount = ref.current.offsetWidth * 0.9;

    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <h2>{title}</h2>

      <div className="carousel-wrapper">
        <button className="arrow left" onClick={() => scroll("left")}>
          ‹
        </button>

        <div className="plots-grid" ref={ref}>
          {children || <p>{emptyMessage}</p>}
        </div>

        <button className="arrow right" onClick={() => scroll("right")}>
          ›
        </button>
      </div>
    </>
  );
}
