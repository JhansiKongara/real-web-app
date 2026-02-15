"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SearchBar from "@/app/components/ui/SearchBar";
import properties from "@/app/lib/properties";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/app/styles/carousel.scss";

export default function Carousel() {
  const featuredSlides = properties.filter((item) => item.featured);

  return (
    <div className="carousel">
      <div className="hero">
        <SearchBar />

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
        >
          {featuredSlides.map((property) => {
            const firstImage = Array.isArray(property.image)
              ? property.image[0]
              : property.image;
            return (
              <SwiperSlide key={property.id}>
                <div className="slide-wrapper">
                  <img src={firstImage} alt={property.title} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
