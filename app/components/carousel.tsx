"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import Slider from "@mui/material/Slider";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import properties from "../../public/data/script";
import "./styles/carousel.scss";

const MIN = 0;
const MAX = 1000000;
const STEP = 50000;

export default function Carousel() {
  const [location, setLocation] = useState<string>("");
  const [values, setValues] = useState<number[]>([MIN, MAX]);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setShowPopover(false);
      }

      if (inputRef.current && !inputRef.current.contains(target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (value: number) => {
    if (value >= 100000)
      return `₹${(value / 100000).toFixed(1).replace(".0", "")}L`;
    return `₹${value}`;
  };

 const handleLocationChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value;
  setLocation(value);

  if (!value.trim()) {
    setSuggestions([]);
    setShowSuggestions(false);
    return;
  }

  const matchesSet = new Set<string>();

  properties.forEach((p: any) => {
    if (p.location.toLowerCase().includes(value.toLowerCase())) {
      matchesSet.add(p.location);
    }
    if (p.city && p.city.toLowerCase().includes(value.toLowerCase())) {
      matchesSet.add(p.city);
    }
  });

  const matches = Array.from(matchesSet).slice(0, 5);
  setSuggestions(matches);
  setShowSuggestions(matches.length > 0);
  setActiveIndex(-1);
};


  const handleSearch = () => {
    const minPrice = values[0] === MIN ? "" : values[0];
    const maxPrice = values[1] === MAX ? "" : values[1];

    router.push(
      `/properties/${location.toLowerCase()}`
    );

    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  return (
    <div className="carousel">
      <div className="hero">
        <h1>Find Your Dream Plot</h1>

        {/* Search */}
        <div className="mb-search">
          <div className="mb-field" ref={inputRef}>
            <input
              type="text"
              placeholder="Enter Location or City"
              value={location}
              onChange={handleLocationChange}
              // autoComplete="off"
            />

            {showSuggestions && (
              <ul className="suggestions">
                {suggestions.map((sugg, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setLocation(sugg);
                      setShowSuggestions(false);
                    }}
                  >
                    {sugg}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price Filter */}
          <div className="price-wrapper" ref={popoverRef}>
            <div
              className="price-display"
              onClick={() => setShowPopover(!showPopover)}
            >
              {values[0] === MIN && values[1] === MAX
                ? "Price"
                : `${formatPrice(values[0])} - ${formatPrice(values[1])}`} ▼
            </div>

            {showPopover && (
              <div className="popover">
                <Slider
                  value={values}
                  onChange={(_, newValue) =>
                    setValues(newValue as number[])
                  }
                  valueLabelDisplay="auto"
                  min={MIN}
                  max={MAX}
                  step={STEP}
                />
              </div>
            )}
          </div>

          <button className="mb-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
        >
          <SwiperSlide>
            <img
              src="https://teja8.kuikr.com//r1/20190614/ak_1280_1262961092-1560507071_700x700.jpeg"
              alt="slide1"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="https://img.freepik.com/premium-psd/real-estate-agency-web-banner-template_486734-381.jpg"
              alt="slide2"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREfpUZDe0Zkm0_Klfdp-MarJtx3BMPlXdnZg&s"
              alt="slide3"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
