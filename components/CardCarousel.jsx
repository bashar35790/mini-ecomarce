"use client"; // Add this at the top for Next.js 13+
import Link from "next/link";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ProductCard from "./ProductCard";

// right arrow component
function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="absolute right-[10px] top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md p-2 rounded-full hover:bg-[#a91f64] hover:text-white cursor-pointer transition-colors z-10 outline-none"
      onClick={onClick}
    >
      {" "}
      <FaArrowRight size={20} />
    </button>
  );
}
// left arrow component
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className="absolute left-[10px] top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md p-2 rounded-full hover:bg-[#a91f64] hover:text-white cursor-pointer transition-colors z-10 outline-none"
      onClick={onClick}
    >
      {" "}
      <FaArrowLeft size={20} />
    </button>
  );
}

const CardCarousel = ({ title, cards = [] }) => {
  // Provide default empty array
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          {title}
        </h2>
        <Link href="/products">
          <span className="text-lg text-gray-600 hover:text-[#a91f64] cursor-pointer">
            view more
          </span>
        </Link>
      </div>

      <div className="relative slider-container">
        {cards.length > 0 ? (
          <Slider {...settings}>
            {cards.map((card, index) => (
              <div key={index} className="px-2">
                <ProductCard
                  id={card.id} // You MUST pass the id!
                  image={card.image}
                  text={card.text}
                  price={card.price}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p>No cards available</p>
        )}
      </div>
    </div>
  );
};

export default CardCarousel;
