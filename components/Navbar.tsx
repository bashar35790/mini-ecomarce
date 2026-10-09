"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaTruck,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import { logout } from "../lib/authSlice";
import { apiClient } from "../lib/api/client";
import toast from "react-hot-toast";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();

  const toggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // get cart items from redux store to display the item count
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // get watchlist items from redux to display item count
  const watchlistItem = useAppSelector((state) => state.watchlist.items);
  const watchlistItemCount = watchlistItem.length;

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      toast.success("Logged out successfully");
      setUserDropdownOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
      {/* left section logo */}
      <Link href="/home" className="flex flex-col leading-tight">
        <span className="text-lg md:text-2xl font-bold text-[#a91f64]">
          Sopifest Store
        </span>
        <span className="text-sm text-gray-500 tracking-widest self-baseline">
          Multi-Category Store
        </span>
      </Link>
      {/* center section */}
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
            New Arrivals
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

      {/* right section icon */}
      <div className="flex items-center gap-5 text-gray-700 text-xl">
        <div className="flex items-center gap-5">
          <FaTruck className="hover:text-[#a01f64] transition-colors cursor-pointer hidden sm:block" />
          <Link href="/wishlist" className="relative">
            <FaHeart className="hover:text-[#a01f64] transition-colors" />
            {watchlistItemCount > 0 && (
              <span className="absolute -top-4 -right-3 text-sm text-white bg-[#a01f64] rounded-full px-1.5 py-0.5">
                {watchlistItemCount}
              </span>
            )}
          </Link>

          <Link className="relative" href="/cart">
            <FaShoppingCart className="hover:text-[#a01f64] transition-colors" />
            {cartItemCount > 0 && (
              <span className="absolute -top-4 -right-3 text-sm text-white bg-[#a01f64] rounded-full px-1.5 py-0.5 max-[768px]:right-1.5 ">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User state display */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#a01f64] transition-colors focus:outline-none"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#a01f64] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <span className="hidden lg:inline-block max-w-[100px] truncate text-xs font-semibold">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-left">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.email}
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-pink-50 text-[#a01f64] rounded-md mt-1">
                      {user.role}
                    </span>
                  </div>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FaSignOutAlt className="text-sm" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-700 hover:text-[#a01f64] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#a01f64] text-white hover:bg-[#8b1a53] transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
        <div className="md:hidden flex">
          <button onClick={toggle} aria-label="Toggle Menu">
            {isMenuOpen ? (
              <FaTimes className="text-2xl hover:text-[#a91f64] cursor-pointer" />
            ) : (
              <FaBars className="text-2xl hover:text-[#a91f64] cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {isMenuOpen ? (
        <ul className="absolute top-full left-0 w-full bg-white flex flex-col items-center gap-4 py-6 text-gray-700 font-medium md:hidden shadow-lg border-b border-gray-100">
          <li>
            <Link className="hover:text-[#a91f63]" onClick={toggle} href="/home">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-[#a91f63]" onClick={toggle} href="/products">
              Products
            </Link>
          </li>
          <li className="w-3/4 border-t border-gray-100 my-1"></li>
          {isAuthenticated && user ? (
            <>
              <li className="text-xs text-gray-500">
                Logged in as <strong className="text-gray-800">{user.name}</strong> ({user.role})
              </li>
              {user.role === "ADMIN" && (
                <li>
                  <Link
                    href="/admin"
                    onClick={toggle}
                    className="text-[#a01f64] font-semibold text-sm"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    toggle();
                  }}
                  className="text-red-600 font-medium text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </li>
            </>
          ) : (
            <div className="flex flex-col gap-2 w-3/4">
              <Link
                className="text-center w-full py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:border-[#a01f64]"
                onClick={toggle}
                href="/login"
              >
                Sign In
              </Link>
              <Link
                className="text-center w-full py-2 bg-[#a01f64] text-white rounded-lg text-sm font-semibold hover:bg-[#8b1a53]"
                onClick={toggle}
                href="/register"
              >
                Register
              </Link>
            </div>
          )}
        </ul>
      ) : null}
    </nav>
  );
};
