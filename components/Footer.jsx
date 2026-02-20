import React from "react";
import { MdArrowForwardIos } from "react-icons/md";

export const Footer = () => {
  return (
    <footer className="py-10 w-full">
      <div className="container flex flex-col mx-auto gap-24">
        <div className="first flex mx-auto w-full justify-between ">
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-2xl font-bold text-[#a91f64]">
              Rupsha Shop
            </span>
            <span className="text-sm text-gray-500 tracking-widest self-baseline">
              Furniture Store
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <p>Ready to get strated?</p>
            <button className="text-2xl font-bold text-white px-6 py-3 rounded-lg cursor-pointer bg-[#a91f64]">
              Get Started
            </button>
          </div>
        </div>
        <div className="middle md:flex md:flex-row gap-44 justify-between flex flex-col">
          <div className="one space-y-5">
            <h3 className="text-[#1C1C1C] font-semibold">Quick Links</h3>
            <div className="space-y-2.5">
              <p className="text-[#494949] font-normal">Home</p>
              <p className="text-[#494949] font-normal">About Us</p>
              <p className="text-[#494949] font-normal">Insurance</p>
              <p className="text-[#494949] font-normal">Privacy Policy</p>
            </div>
          </div>

          <div className="two space-y-5">
            <h3 className="text-[#1C1C1C] font-semibold">Our Service</h3>
            <div className="space-y-2.5">
              <p className="text-[#494949] font-normal">Life Insurance</p>
              <p className="text-[#494949] font-normal">Car Insurance</p>
              <p className="text-[#494949] font-normal">Health Insurance</p>
              <p className="text-[#494949] font-normal">House Insurance</p>
            </div>
          </div>

          <div className="three space-y-5">
            <h3 className="text-[#1C1C1C] font-semibold">Help</h3>
            <div className="space-y-2.5">
              <p className="text-[#494949] font-normal">FAQs</p>
              <p className="text-[#494949] font-normal">Contact Us</p>
            </div>
          </div>

          <div className="four space-y-5">
            <h3 className="text-[#1C1C1C] text-2xl font-semibold">
              Subscribe to our <br />
              newsletter
            </h3>
            <div className="flex items-center">
              <form className="border-b border-[#494949] flex ">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  required
                  className="py-2 pr-2"
                />
              </form>
              <MdArrowForwardIos className="text-2xl text-[#a91f64]" />
            </div>
          </div>
        </div>
        <div className="bottom text-center">
          <p className="text-[#494949] font-medium">
            © 2027 Rupsha Shop. - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
