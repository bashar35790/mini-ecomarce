"use client";

import React from "react";
import Slider, { Settings } from "react-slick";
import Image, { StaticImageData } from "next/image";
import slider1 from "../public/images/banner.png";
import slider2 from "../public/images/slider2.jpg";
import slider3 from "../public/images/slider3.jpg";

export const SiderComponent: React.FC = () => {
  const sliders: StaticImageData[] = [slider1, slider2, slider3];
  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    dots: true,
  };

  return (
    <div className="w-full mx-auto my-6" id="home">
      <Slider {...settings}>
        {sliders.map((slide, index) => (
          <div key={index} className="relative outline-none">
            <div className="w-full relative h-90 sm:h-110 md:h-125">
              <Image
                src={slide}
                alt={`Promo banner ${index + 1}`}
                fill
                priority={index === 0}
                className="rounded-2xl md:rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl md:rounded-3xl"></div>

              {index === 0 && (
                <div className="absolute inset-0 flex justify-center md:justify-start items-center text-center md:text-left px-6 sm:px-16">
                  <div className="space-y-3 max-w-xl">
                    <span className="text-white text-3xl sm:text-5xl font-extrabold uppercase tracking-wide block">
                      Hot Offers
                    </span>
                    <span className="text-[#a91f64] text-5xl sm:text-8xl font-black block drop-shadow-sm">
                      50% OFF
                    </span>
                    <p className="text-gray-100 text-sm sm:text-base">
                      Explore top-trending fashion, tech gadgets, handcrafted
                      toys & home essentials.
                    </p>
                  </div>
                </div>
              )}

              {index === 1 && (
                <div className="absolute inset-0 flex justify-center items-center text-white text-center px-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-6xl font-bold tracking-tight">
                      Brand New
                    </h2>
                    <h2 className="text-[#a91f64] text-4xl sm:text-8xl font-black">
                      Collections
                    </h2>
                    <p className="text-gray-200 text-sm sm:text-lg max-w-md mx-auto">
                      Discover our multi-category arrivals curated for quality
                      and durability.
                    </p>
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="absolute inset-0 flex justify-center md:justify-end items-center px-6 sm:px-16">
                  <div className="flex flex-col items-center md:items-end space-y-3 text-center md:text-right">
                    <span className="text-[#a91f64] text-5xl sm:text-8xl font-black leading-none uppercase">
                      DEAL
                    </span>
                    <span className="text-lg sm:text-3xl font-bold uppercase py-1.5 px-4 bg-white text-gray-900 rounded-lg shadow">
                      Of The Week
                    </span>
                    <span className="text-white text-sm sm:text-base">
                      Limited Stock Available — Grab It While It Lasts
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SiderComponent;
