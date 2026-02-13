"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Slider from "@mui/material/Slider";
import properties from "../../public/data/script";

const MIN = 0;
const MAX = 1000000;
const STEP = 50000;

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [values, setValues] = useState<number[]>([MIN, MAX]);
  const [showPopover, setShowPopover] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setShowPopover(false);
      }

      if (inputRef.current && !inputRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (value: number) =>
    value >= 100000
      ? `₹${(value / 100000).toFixed(1).replace(".0", "")}L`
      : `₹${value}`;

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

    const matches = Array.from(
      new Set(
        properties
          .flatMap((p: any) => [p.location, p.city])
          .filter(Boolean)
          .filter((loc: string) =>
            loc.toLowerCase().includes(value.toLowerCase())
          )
      )
    ).slice(0, 5);

    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

  const handleSearch = () => {
    router.push(`/properties/${location.toLowerCase()}`);
    setShowSuggestions(false);
  };

  return (
    <div className="mb-search">
      <div className="mb-field" ref={inputRef}>
        <input
          type="text"
          placeholder="Enter Location or City"
          value={location}
          onChange={handleLocationChange}
        />

        {showSuggestions && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setLocation(s);
                  setShowSuggestions(false);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

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
              onChange={(_, v) => setValues(v as number[])}
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
  );
}
