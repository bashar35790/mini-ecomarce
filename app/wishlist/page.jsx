"use client";

import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/cartSlice";
import { removeFromWatchlist } from "@/lib/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.watchlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWatchlist(id));
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Wishlist</h1>

      <p className="text-gray-600 mb-6">
        {wishlist.length} item{wishlist.length !== 1 && "s"} in your wishlist
      </p>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {wishlist.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-700 mb-4">Your wishlist is empty</p>
            <Link
              href="/products"
              className="inline-block bg-[#a91f64] text-white px-4 py-2 rounded-md hover:bg-[#8a1b54]"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 font-semibold text-gray-700 mb-4">
              <div>Product</div>
              <div>Price</div>
              <div>Stock</div>
              <div>Actions</div>
            </div>

            {/* Items */}
            {wishlist.map((item, index) => (
              <div
                key={item.id}
                className={`flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-4 ${
                  index !== wishlist.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                {/* Product */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.text}
                      fill
                      className="rounded object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">{item.text}</p>

                      {/* Mobile delete */}
                      <FaTrash
                        className="sm:hidden text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemove(item.id)}
                      />
                    </div>

                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-gray-700">
                  ${Number(item.price || 0).toFixed(2)}
                </div>

                {/* Stock */}
                <div
                  className={`font-semibold ${
                    item.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="bg-[#a91f64] text-white px-4 py-2 rounded-md hover:bg-[#8a1b54] disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>

                  {/* Desktop delete */}
                  <FaTrash
                    className="hidden sm:block text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemove(item.id)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
