"use client";

import React from "react";
import Link from "next/link";
import Slider, { CustomArrowProps, Settings } from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ProductCard from "./ProductCard";

function SampleNextArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      type="button"
      aria-label="Next slide"
      className="absolute right-[10px] top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md p-2 rounded-full hover:bg-[#a91f64] hover:text-white cursor-pointer transition-colors z-10 outline-none"
      onClick={onClick}
    >
      <FaArrowRight size={20} />
    </button>
  );
}

function SamplePrevArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      type="button"
      aria-label="Previous slide"
      className="absolute left-[10px] top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md p-2 rounded-full hover:bg-[#a91f64] hover:text-white cursor-pointer transition-colors z-10 outline-none"
      onClick={onClick}
    >
      <FaArrowLeft size={20} />
    </button>
  );
}

export interface CarouselCard {
  id: string | number;
  productId?: string;
  image: string;
  text?: string;
  title?: string;
  price: number | string;
  category?: string;
  inStock?: boolean;
  slug?: string;
}

export interface CardCarouselProps {
  title: string;
  cards?: CarouselCard[];
}

const CardCarousel: React.FC<CardCarouselProps> = ({ title, cards = [] }) => {
  const settings: Settings = {
    dots: false,
    infinite: cards.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, infinite: cards.length > 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, infinite: cards.length > 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, infinite: cards.length > 1 },
      },
    ],
  };

  return (
    <div className="w-full mx-auto my-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          {title}
        </h2>
        <Link href="/products">
          <span className="text-base font-semibold text-[#a91f64] hover:underline cursor-pointer">
            View all &rarr;
          </span>
        </Link>
      </div>

      <div className="relative slider-container">
        {cards.length > 0 ? (
          <Slider {...settings}>
            {cards.map((card, index) => (
              <div key={`${card.id}-${index}`} className="px-2">
                <ProductCard
                  id={card.productId ?? card.id}
                  productId={card.productId}
                  image={card.image}
                  text={card.text}
                  title={card.title}
                  price={card.price}
                  category={card.category}
                  inStock={card.inStock}
                  slug={card.slug}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-gray-500 py-6 text-center">
            No products available
          </p>
        )}
      </div>
    </div>
  );
};

export default CardCarousel;
