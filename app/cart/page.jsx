"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "@/lib/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Update quantity (minimum 1)
  const handleUpdateQuantity = (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // Subtotal price
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Total items count
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="w-full max-w-7xl mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Shopping Bag
      </h1>
      <p className="text-gray-600 mb-6">
        {totalItems} item{totalItems !== 1 && "s"} in your bag
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-700 mb-4">Your cart is empty</p>
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
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 text-gray-700 font-semibold mb-4">
                  <div>Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Total</div>
                </div>

                {/* Items */}
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-start sm:items-center py-4 ${
                      index !== cartItems.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    }`}
                  >
                    {/* Product */}
                    <div className="flex items-center gap-4 w-full">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.text}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.text}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-gray-700">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-200"
                      >
                        -
                      </button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#a91f64]"
                />
                <button className="bg-[#a91f64] text-white px-4 py-2 rounded-md hover:bg-[#8a1b54]">
                  Apply
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-4 text-gray-700">
                <span>Total</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>

              <button
                disabled={!cartItems.length}
                className="w-full bg-[#a91f64] text-white py-2 rounded-md hover:bg-[#8a1b54] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
