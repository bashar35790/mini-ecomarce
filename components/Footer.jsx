import React from "react";
import { MdArrowForwardIos } from "react-icons/md";

export const Footer = () => {
  return (
    <footer class="py-10 w-full">
      <div class="container flex flex-col mx-auto gap-24">
        <div class="first flex mx-auto w-full justify-between ">
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-2xl font-bold text-[#a91f64]">
              Rupsha Shop
            </span>
            <span className="text-sm text-gray-500 tracking-widest self-baseline">
              Furniture Store
            </span>
          </div>
          <div class="flex gap-2 items-center">
            <p>Ready to get strated?</p>
            <button class="text-2xl font-bold text-white px-6 py-3 rounded-lg cursor-pointer bg-[#a91f64]">
              Get Started
            </button>
          </div>
        </div>
        <div class="middle md:flex md:flex-row gap-44 justify-between flex flex-col">
          <div class="one space-y-5">
            <h3 class="text-[#1C1C1C] font-semibold">Quick Links</h3>
            <div class="space-y-2.5">
              <p class="text-[#494949] font-normal">Home</p>
              <p class="text-[#494949] font-normal">About Us</p>
              <p class="text-[#494949] font-normal">Insurance</p>
              <p class="text-[#494949] font-normal">Privacy Policy</p>
            </div>
          </div>

          <div class="two space-y-5">
            <h3 class="text-[#1C1C1C] font-semibold">Our Service</h3>
            <div class="space-y-2.5">
              <p class="text-[#494949] font-normal">Life Insurance</p>
              <p class="text-[#494949] font-normal">Car Insurance</p>
              <p class="text-[#494949] font-normal">Health Insurance</p>
              <p class="text-[#494949] font-normal">House Insurance</p>
            </div>
          </div>

          <div class="three space-y-5">
            <h3 class="text-[#1C1C1C] font-semibold">Help</h3>
            <div class="space-y-2.5">
              <p class="text-[#494949] font-normal">FAQs</p>
              <p class="text-[#494949] font-normal">Contact Us</p>
            </div>
          </div>

          <div class="four space-y-5">
            <h3 class="text-[#1C1C1C] text-2xl font-semibold">
              Subscribe to our <br />
              newsletter
            </h3>
            <div class="flex items-center">
              <form class="border-b border-[#494949] flex ">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  required
                  class="py-2 pr-2"
                />
              </form>
              <MdArrowForwardIos className="text-2xl text-[#a91f64]" />
            </div>
          </div>
        </div>
        <div class="bottom text-center">
          <p class="text-[#494949] font-medium">
            © 2027 Rupsha Shop. - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
