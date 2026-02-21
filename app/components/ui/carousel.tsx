"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SearchBar from "@/app/components/ui/SearchBar";
import properties from "@/app/lib/properties";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Carousel() {
  const featuredSlides = properties.filter((item) => item.featured);

  return (
    <div className="w-full mt-0 md:mt-[30px] font-['Outfit']">
      <div className="relative w-full max-w-[1400px] mx-auto px-5 lg:mt-[15px] md:mt-[5px] sm:px-[5px]">
        <SearchBar />

        <div className="mt-[25px] mb-[25px] md:mb-0 rounded-[20px] overflow-hidden bg-[var(--card)] shadow-[0_0_30px_rgba(var(--primary-rgb),0.25)] border-2 border-[var(--primary)]/50 transition-all duration-500 hover:border-[var(--primary)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.5)] group relative z-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            className="w-full h-[250px] md:h-[400px]"
          >
            {featuredSlides.map((property) => {
              const firstImage = Array.isArray(property.image)
                ? property.image[0]
                : property.image;
              return (
                <SwiperSlide key={property.id}>
                  <div className="relative w-full h-full">
                    <img
                      src={firstImage}
                      alt={property.title}
                      className="w-full h-full object-cover brightness-[0.95] transition-transform duration-800 ease-[cubic-bezier(0.2,1,0.3,1)]"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: var(--foreground) !important;
          width: auto !important;
          height: auto !important;
          background: transparent !important;
          border: none !important;
          transition: all 0.3s ease !important;
          padding: 10px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          opacity: 0.8;
        }

        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 32px !important;
          font-weight: 800 !important;
          text-shadow:
            0 0 5px rgba(0, 0, 0, 0.4),
            0 0 15px rgba(var(--primary-rgb), 0.6) !important;
        }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          color: var(--primary) !important;
          text-shadow: 0 0 15px rgba(var(--primary-rgb), 0.8) !important;
          transform: translateY(-50%) scale(1.1) !important;
          opacity: 1;
        }

        .swiper-button-prev {
          left: 10px !important;
        }
        .swiper-button-next {
          right: 10px !important;
        }

        .swiper-pagination-bullet {
          background: var(--foreground) !important;
          opacity: 0.3 !important;
          width: 10px !important;
          height: 10px !important;
          margin: 0 6px !important;
          transition: all 0.4s ease !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) !important;
        }

        .swiper-pagination-bullet-active {
          background: var(--primary) !important;
          opacity: 1 !important;
          width: 24px !important;
          border-radius: 6px !important;
          box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5) !important;
        }

        @media (max-width: 768px) {
          .swiper-button-prev:after,
          .swiper-button-next:after {
            font-size: 24px !important;
          }
          .swiper-button-prev {
            left: 5px !important;
          }
          .swiper-button-next {
            right: 5px !important;
          }
        }
      `}</style>
    </div>
  );
}
