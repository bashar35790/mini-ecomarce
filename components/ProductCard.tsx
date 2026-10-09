"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaCheck, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, removeFromCart } from "@/lib/cartSlice";
import { toggleWishlistItem } from "@/lib/accountSync";
import { store } from "@/lib/store";
import type { WishlistItem } from "@/lib/wishlistSlice";

export interface ProductCardProps {
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

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  productId,
  image,
  text,
  title,
  price,
  category = "General",
  inStock = true,
  slug,
}) => {
  const dispatch = useAppDispatch();
  const displayName = title || text || "Product";
  // Task 32: keep the real Mongo ObjectId so cart/wishlist sync can talk
  // to the backend; fall back to the display id for legacy static cards.
  const backendId = productId ?? (typeof id === "string" ? id : undefined);

  const cartItems = useAppSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => String(item.id) === String(id));

  const watchlistItems = useAppSelector((state) => state.watchlist.items);
  const isInWatchlist = watchlistItems.some((item) => String(item.id) === String(id));

  const numericPrice =
    typeof price === "string"
      ? parseFloat(price.replace("$", "")) || 0
      : Number(price) || 0;

  const handleToggleHeart = () => {
    const item: WishlistItem = {
      id: backendId ?? id,
      productId: backendId,
      image,
      text: displayName,
      title: displayName,
      price: numericPrice,
      quantity: 1,
      category,
      inStock,
    };
    // Task 32: optimistic local toggle, mirrored to /wishlist when logged in.
    toggleWishlistItem(dispatch, store.getState, item).then((inWishlist) => {
      toast.success(inWishlist ? "Added to wishlist" : "Removed from wishlist", {
        duration: 1000,
        position: "bottom-center",
        icon: <FaCheck className="text-white" />,
        style: {
          background: inWishlist ? "#22c55e" : "#ef4444",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          padding: "10px 18px",
          borderRadius: "6px",
        },
      });
    });
  };

  const handleToggleCart = () => {
    if (isInCart) {
      dispatch(removeFromCart(backendId ?? id));
      toast.success("Removed from cart", {
        duration: 1000,
        position: "bottom-center",
        icon: <FaCheck className="text-white" />,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          padding: "10px 18px",
          borderRadius: "6px",
        },
      });
    } else {
      dispatch(
        addToCart({
          id: backendId ?? id,
          productId: backendId,
          image,
          text: displayName,
          title: displayName,
          price: numericPrice,
          quantity: 1,
          category,
          inStock,
        })
      );
      toast.success("Added to cart", {
        duration: 1000,
        position: "bottom-center",
        icon: <FaCheck className="text-white" />,
        style: {
          background: "#22c55e",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          padding: "10px 18px",
          borderRadius: "6px",
        },
      });
    }
  };

  return (
    <div className="py-4">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-[340px] border border-gray-100">
        {slug ? (
          <Link
            href={`/products/${slug}`}
            className="relative w-full h-48 bg-gray-50 overflow-hidden block"
          >
            <Image
              src={image}
              alt={displayName}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="hover:scale-105 transition-transform duration-300"
            />
          </Link>
        ) : (
          <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
            <Image
              src={image}
              alt={displayName}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4 flex flex-col justify-between flex-1 text-left">
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              {category}
            </span>
            <h3 className="text-base font-semibold text-gray-800 mt-1 line-clamp-1">
              {slug ? (
                <Link href={`/products/${slug}`} className="hover:underline">
                  {displayName}
                </Link>
              ) : (
                displayName
              )}
            </h3>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-lg font-bold text-gray-900">
              ${numericPrice.toFixed(2)}
            </span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleToggleHeart}
                aria-label="Toggle wishlist"
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaHeart
                  className={`text-lg transition-colors ${
                    isInWatchlist
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={handleToggleCart}
                aria-label="Toggle cart"
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaShoppingCart
                  className={`text-lg transition-colors ${
                    isInCart
                      ? "text-green-600"
                      : "text-gray-400 hover:text-green-600"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
