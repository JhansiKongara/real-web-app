"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import properties from "../../public/data/script";
import "./styles/plots.scss";

interface Property {
  id: number;
  title: string;
  location: string;
  city: string;
  price: number;
  image: string;
  status: string;
}

export default function Plots() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  const recentlyUploaded: Property[] = [...properties]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

  const availablePlots: Property[] = properties.filter((item) => {
    if (item.status !== "available") return false;
    if (!searchTerm) return true;

    const lowerSearch = searchTerm.toLowerCase();

    return (
      item.location.toLowerCase().includes(lowerSearch) ||
      item.city.toLowerCase().includes(lowerSearch) ||
      item.price.toString().includes(lowerSearch)
    );
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewed: Property[] = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );
      setRecentlyViewed(viewed);
    }
  }, []);

  const handleViewDetails = (property: Property) => {
    if (typeof window !== "undefined") {
      let viewed: Property[] = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );

      viewed = viewed.filter((item) => item.id !== property.id);
      viewed.unshift(property);
      viewed = viewed.slice(0, 10);

      localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
      setRecentlyViewed(viewed);
    }

    router.push(`/property/${property.id}`);
  };

  const recentlyUploadedRef = useRef<HTMLDivElement | null>(null);
  const availablePlotsRef = useRef<HTMLDivElement | null>(null);
  const recentlyViewedRef = useRef<HTMLDivElement | null>(null);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (!ref.current) return;

    const scrollAmount = ref.current.offsetWidth * 0.9;

    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="plots-page">

      {/* ================= Recently Uploaded ================= */}
      <h2>Recently Uploaded Plot</h2>

      <div className="carousel-wrapper">
        <button
          className="arrow left"
          onClick={() => scroll(recentlyUploadedRef, "left")}
        >
          ‹
        </button>

        <div className="plots-grid" ref={recentlyUploadedRef}>
          {recentlyUploaded.map((item) => (
            <div className="card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>Location: {item.location}</p>
              <h4>₹{formatPrice(item.price)}</h4>

              <button onClick={() => handleViewDetails(item)}>
                View Details →
              </button>
            </div>
          ))}
        </div>

        <button
          className="arrow right"
          onClick={() => scroll(recentlyUploadedRef, "right")}
        >
          ›
        </button>
      </div>

      {/* ================= Available Plots ================= */}
      <h2>
        Available Plot {searchTerm && `(Search: "${searchTerm}")`}
      </h2>

      <div className="carousel-wrapper">
        <button
          className="arrow left"
          onClick={() => scroll(availablePlotsRef, "left")}
        >
          ‹
        </button>

        <div className="plots-grid" ref={availablePlotsRef}>
          {availablePlots.length === 0 ? (
            <p>No plots found matching your search.</p>
          ) : (
            availablePlots.map((item) => (
              <div className="card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>Location: {item.location}</p>
                <p>City: {item.city}</p>
                <h4>₹{formatPrice(item.price)}</h4>

                <button onClick={() => handleViewDetails(item)}>
                  View Details →
                </button>
              </div>
            ))
          )}
        </div>

        <button
          className="arrow right"
          onClick={() => scroll(availablePlotsRef, "right")}
        >
          ›
        </button>
      </div>

      {/* ================= Recently Viewed ================= */}
      <h2>Recently Viewed Plot</h2>

      <div className="carousel-wrapper">
        <button
          className="arrow left"
          onClick={() => scroll(recentlyViewedRef, "left")}
        >
          ‹
        </button>

        <div className="plots-grid" ref={recentlyViewedRef}>
          {recentlyViewed.length === 0 ? (
            <p>No recently viewed plots.</p>
          ) : (
            recentlyViewed.map((item) => (
              <div className="card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>Location: {item.location}</p>
                <p>City: {item.city}</p>
                <h4>₹{formatPrice(item.price)}</h4>

                <button onClick={() => handleViewDetails(item)}>
                  View Details →
                </button>
              </div>
            ))
          )}
        </div>

        <button
          className="arrow right"
          onClick={() => scroll(recentlyViewedRef, "right")}
        >
          ›
        </button>
      </div>

    </div>
  );
}
