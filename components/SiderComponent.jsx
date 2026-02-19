"use client";
import Slider from "react-slick";
import slider1 from "../public/images/slider1.jpg";
import slider2 from "../public/images/slider2.jpg";
import slider3 from "../public/images/slider3.jpg";
import Image from "next/image";

export const SiderComponent = () => {
  const sliders = [slider1, slider2, slider3];
  const settings = {
    infinite: true,
    speed: 500,
    slideToShow: 1,
    slideToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div className="w-full mx-auto my-8" id="home">
      <Slider {...settings}>
        {sliders.map((slide, index) => (
          <div key={index} className="relative">
            <div className="w-full relative h-[500px]">
              <Image
                src={slide}
                alt="slider image"
                fill
                className="rounded-3xl"
              />
              {/* dark overlay of the image  */}
              <div className="absolute inset-0 bg-black opacity-30 rounded-3xl"></div>
              {/* conditonal overlay text for eatch slide  */}
              {index === 0 && (
                <div className="absolute inset-0 flex justify-center md:justify-startmx-[50%] text-center">
                  <div className="pl-0 sm:pl-20 h-full flex flex-col justify-center items-center space-y-4">
                    <span className="text-white text-5xl lg:text-5xl font-extrabold uppercase text-center">
                      Hot Offers
                    </span>
                    <span className="text-[#a91f64] text-6xl md:text-9xl font-bold text-center">
                      50%
                    </span>
                  </div>
                </div>
              )}
              {index === 1 && (
                <div className="absolute inset-0 flex justify-center items-center text-white text-center">
                  <div className="text-center space-y-2">
                    <h2 className="text-4xl text-white sm:text-6xl lg:text-7xl font-bold flex items-start">
                      New
                    </h2>

                    <h2 className="text-[#a91f64] text-4xl sm:text-6xl lg:text-9xl font-light ">
                      Collection...
                    </h2>
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold flex justify-end"></h2>
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="absolute inset-0 flex justify-center items-center md:justify-end pr-10">
                  <div className="w-1/2 flex flex-col items-center space-y-3">
                    <span className="text-[#a91f64] text-7xl md:text-9xl font-extrabold leading-none uppercase text-center">
                      Deal
                    </span>
                    <span className="text-xl md:text-5xl font-semibold uppercase py-2 text-center bg-white text-black w-fit px-3 sm:px-4">
                      Of The Week
                    </span>
                    <span className="text-white text-sm md:text-base text-center">
                      Limited Time Only - Grad It Now
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
