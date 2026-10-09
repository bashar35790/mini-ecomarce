import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import {
  MdCheckCircle,
  MdLocalShipping,
  MdShield,
  MdHeadsetMic,
  MdSend,
} from "react-icons/md";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#fcf8f9] text-gray-800 pt-8 overflow-hidden font-sans">
      <div className="container mx-auto">
        {/* TOP FEATURES / SERVICE HIGHLIGHTS BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-[#a91f64]/10 text-[#a91f64] text-2xl">
              <MdCheckCircle />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">
                Authentic Products
              </h4>
              <p className="text-xs text-gray-500">Manufacturer warranty</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-[#a91f64]/10 text-[#a91f64] text-2xl">
              <MdLocalShipping />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">
                Fast Delivery
              </h4>
              <p className="text-xs text-gray-500">Nationwide shipping</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-[#a91f64]/10 text-[#a91f64] text-2xl">
              <MdShield />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">
                Secure Payment
              </h4>
              <p className="text-xs text-gray-500">100% safe & trusted</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-[#a91f64]/10 text-[#a91f64] text-2xl">
              <MdHeadsetMic />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">
                Customer Support
              </h4>
              <p className="text-xs text-gray-500">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* DARK MAIN FOOTER CONTENT WITH WAVE EFFECT */}
      <div className="bg-[#4d092b] text-white pt-12 pb-6 relative rounded-t-[35px] md:rounded-t-[50px]">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a91f64] opacity-20 blur-3xl pointer-events-none -z-0" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
            {/* BRAND / LOGO SECTION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-extrabold text-white">
                  Sopifest <span className="text-[#f472b6]">Store</span>
                </span>
              </div>
              <p className="text-xs text-pink-200 tracking-wider font-light">
                Multi-Category Store
              </p>
              <p className="text-sm text-pink-100/80 pt-2 leading-relaxed">
                Your one-stop destination for quality clothing, electronics,
                toys, and furniture.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm text-pink-100/80">
                <li>
                  <Link
                    href="/home"
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors"
                  >
                    Shop Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* SOCIAL MEDIA / FOLLOW US */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white tracking-wide">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#a91f64] transition-all hover:scale-105 text-white"
                >
                  <FaFacebookF size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#a91f64] transition-all hover:scale-105 text-white"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#a91f64] transition-all hover:scale-105 text-white"
                >
                  <FaYoutube size={18} />
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#a91f64] transition-all hover:scale-105 text-white"
                >
                  <FaTiktok size={18} />
                </a>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white tracking-wide">
                Newsletter
              </h3>
              <p className="text-sm text-pink-100/80">
                Get the latest news and special offers delivered to your inbox.
              </p>
              <form className="relative flex items-center mt-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="w-full py-3 pl-4 pr-12 rounded-full bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#a91f64] text-sm"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 p-2.5 rounded-full bg-[#a91f64] hover:bg-[#8f1954] text-white transition-all cursor-pointer"
                >
                  <MdSend className="text-lg" />
                </button>
              </form>
            </div>
          </div>

          {/* BOTTOM BAR / COPYRIGHT & LEGAL */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-pink-200/70 gap-4">
            <p>
              © {new Date().getFullYear()} Sopifest Store. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
