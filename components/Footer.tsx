import React from "react";
import { MdArrowForwardIos } from "react-icons/md";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-10 w-full">
      <div className="container flex flex-col mx-auto gap-24 px-6 md:px-0">
        <div className="first flex flex-col md:flex-row mx-auto w-full justify-between gap-8 md:gap-0">
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-2xl font-bold text-[#a91f64]">
              Sopifest Store
            </span>
            <span className="text-sm text-gray-500 tracking-widest self-baseline">
              Multi-Category Store
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-gray-700">Ready to start shopping?</p>
            <Link href="/products">
              <button className="text-lg font-bold text-white px-6 py-3 rounded-lg cursor-pointer bg-[#a91f64] hover:bg-[#8f1954] transition-colors">
                Explore Now
              </button>
            </Link>
          </div>
        </div>
        <div className="middle grid grid-cols-1 md:grid-cols-4 gap-12 justify-between">
          <div className="one space-y-5">
            <h3 className="text-[#1C1C1C] font-semibold">Quick Links</h3>
            <div className="space-y-2.5">
              <Link href="/home" className="block text-[#494949] font-normal hover:text-[#a91f64]">Home</Link>
              <Link href="/about" className="block text-[#494949] font-normal hover:text-[#a91f64]">About Us</Link>
              <Link href="/products" className="block text-[#494949] font-normal hover:text-[#a91f64]">Shop</Link>
              <Link href="/privacy" className="block text-[#494949] font-normal hover:text-[#a91f64]">Privacy Policy</Link>
            </div>
          </div>

          <div className="two space-y-5">
            <h3 className="text-[#1C1C1C] font-semibold">Our Categories</h3>
            <div className="space-y-2.5">
              <Link href="/category/clothing" className="block text-[#494949] font-normal hover:text-[#a91f64]">Clothing</Link>
              <Link href="/category/electronics" className="block text-[#494949] font-normal hover:text-[#a91f64]">Electronics</Link>
              <Link href="/category/toys" className="block text-[#494949] font-normal hover:text-[#a91f64]">Toys</Link>
              <Link href="/category/furniture" className="block text-[#494949] font-normal hover:text-[#a91f64]">Furniture</Link>
            </div>
          </div>

          <div className="three space-y-5">
            <h3 className="text-[#1C1C1C] font-semibold">Help</h3>
            <div className="space-y-2.5">
              <Link href="/faq" className="block text-[#494949] font-normal hover:text-[#a91f64]">FAQs</Link>
              <Link href="/contact" className="block text-[#494949] font-normal hover:text-[#a91f64]">Contact Us</Link>
              <Link href="/shipping" className="block text-[#494949] font-normal hover:text-[#a91f64]">Shipping & Returns</Link>
            </div>
          </div>

          <div className="four space-y-5">
            <h3 className="text-[#1C1C1C] text-2xl font-semibold">
              Subscribe to our <br />
              newsletter
            </h3>
            <div className="flex items-center">
              <form className="border-b border-[#494949] flex w-full">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  required
                  className="py-2 pr-2 bg-transparent outline-none w-full"
                />
                <button type="submit" className="cursor-pointer ml-2">
                  <MdArrowForwardIos className="text-2xl text-[#a91f64]" />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="bottom text-center">
          <p className="text-[#494949] font-medium">
            © {new Date().getFullYear()} Sopifest Store. - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
