"use client";

import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaCheck, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, removeFromCart } from "@/lib/cartSlice";
import { addToWatchlist, removeFromWatchlist } from "@/lib/wishlistSlice";

export interface ProductCardProps {
  id: string | number;
  image: string;
  text?: string;
  title?: string;
  price: number | string;
  category?: string;
  inStock?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  text,
  title,
  price,
  category = "General",
  inStock = true,
}) => {
  const dispatch = useAppDispatch();
  const displayName = title || text || "Product";

  const cartItems = useAppSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => String(item.id) === String(id));

  const watchlistItems = useAppSelector((state) => state.watchlist.items);
  const isInWatchlist = watchlistItems.some((item) => String(item.id) === String(id));

  const numericPrice =
    typeof price === "string"
      ? parseFloat(price.replace("$", "")) || 0
      : Number(price) || 0;

  const handleToggleHeart = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(id));
      toast.success("Removed from wishlist", {
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
        addToWatchlist({
          id,
          image,
          text: displayName,
          title: displayName,
          price: numericPrice,
          quantity: 1,
          category,
          inStock,
        })
      );
      toast.success("Added to wishlist", {
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

  const handleToggleCart = () => {
    if (isInCart) {
      dispatch(removeFromCart(id));
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
          id,
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
        <div className="p-4 flex flex-col justify-between flex-1 text-left">
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              {category}
            </span>
            <h3 className="text-base font-semibold text-gray-800 mt-1 line-clamp-1">
              {displayName}
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
