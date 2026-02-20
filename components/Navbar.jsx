"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaTruck,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //get cart items from redux store to display the item count
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // get watchlist items from redux to display item count
  const watchlistItem = useSelector((state) => state.watchlist.items);
  const watchlistItemCount = watchlistItem.length;

  return (
    <nav className="sticky top-0 z-50 bg-slate-50 px-6 py-4 flex items-center justify-between ">
      {/* // left section logo  */}
      <div className="flex flex-col leading-tight">
        <span className="text-lg md:text-2xl font-bold text-[#a91f64]">
          Rupsha Shop
        </span>
        <span className="text-sm text-gray-500 tracking-widest self-baseline">
          Furniture Store
        </span>
      </div>
      {/* center section  */}
      <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
        <li>
          <Link href="/home" className="hover:text-[#a01f64] transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="hover:text-[#a01f64] cursor-pointer transition-colors"
          >
            New Arrial
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="hover:text-[#a01f64] cursor-pointer transition-colors"
          >
            Top Sellers
          </Link>
        </li>
        <li>
          <Link
            href="/products"
            className="hover:text-[#a01f64] transition-colors"
          >
            Products
          </Link>
        </li>
      </ul>

      {/* right section icon  */}
      <div className="flex items-center gap-6 text-gray-700 text-xl">
        <div className="flex gap-6">
          <FaTruck className="hover:text-[#a01f64] transition-colors" />
          <Link href="/wishlist" className="relative">
            <FaHeart className="hover:text-[#a01f64] transition-colors" />
            {watchlistItemCount > 0 && (
              <span className="absolute -top-4 -right-3 text-sm text-white bg-[#a01f64] rounded-full px-1.5 p-0.4">
                {watchlistItemCount}
              </span>
            )}
          </Link>

          <Link className="relavite" href="/cart">
            <FaShoppingCart className="hover:text-[#a01f64] transition-colors" />
            {cartItemCount > 0 && (
              <span className="absolute top-4 right-3 text-sm text-white bg-[#a01f64] rounded-full px-1.5 p-0.4 max-[768px]:right-15 ">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
        <div className="md:hidden flex">
          <button onClick={toggle}>
            {isMenuOpen ? (
              <FaTimes className="text-2xl hover:text-[#a91f64] cursor-pointer" />
            ) : (
              <FaBars className="text-2xl hover:text-[#a91f64] cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      {/* mobile menu  */}
      {isMenuOpen ? (
        <ul className="absolute top-full left-0 w-full bg-white flex flex-col items-center gap-4 py-4 text-gray-700 font-medium md:hidden shadow-md">
          <li>
            <Link className="hover:text-[#a91f63]" onClick={toggle} href="/">
              Home
            </Link>
          </li>
          <li className="hover:text-[#a91f63]" onClick={toggle}>
            New Arrivals
          </li>
          <li className="hover:text-[#a91f63]" onClick={toggle}>
            Top Sellers
          </li>
          <li>
            <Link className="hover:text-[#a91f63]" onClick={toggle} href="/">
              Products
            </Link>
          </li>
        </ul>
      ) : (
        ""
      )}
    </nav>
  );
};
