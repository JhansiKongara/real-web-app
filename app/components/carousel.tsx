"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SearchBar from "../components/SearchBar";
import properties from "../../public/data/script";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles/carousel.scss";

export default function Carousel() {
  // Get only featured properties for hero slider
  const featuredSlides = properties.filter(
    (item) => item.featured
  );

  return (
    <div className="carousel">
      <div className="hero">
        <h1>Find Your Dream Plot</h1>

        <SearchBar />

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
        >
          {featuredSlides.map((property) => (
            <SwiperSlide key={property.id}>
              <div className="slide-wrapper">
                <img
                  src={property.image}
                  alt={property.title}
                />
                <div className="slide-content">
                  <h2>{property.title}</h2>
                  <p>
                    {property.location}, {property.city}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
