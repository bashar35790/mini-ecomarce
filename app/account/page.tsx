"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

export default function AccountPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        My Account
      </h1>
      <p className="text-gray-600 mb-6">
        {user ? `Welcome back, ${user.name}` : "Your profile and orders"}
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          {user && (
            <dl className="text-sm space-y-1 text-gray-600 mb-4">
              <div className="flex justify-between">
                <dt>Name</dt>
                <dd className="text-gray-800 font-medium">{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Email</dt>
                <dd className="text-gray-800 font-medium">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Role</dt>
                <dd className="text-gray-800 font-medium">{user.role}</dd>
              </div>
            </dl>
          )}
          <p className="text-xs text-gray-500">
            Address book and profile editing arrive with a dedicated settings
            task.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <p className="text-sm text-gray-600 mb-4">
            Track deliveries, review receipts, and reorder favorites.
          </p>
          <Link
            href="/account/orders"
            className="inline-block bg-[#a91f64] text-white px-5 py-2 rounded-md hover:bg-[#8a1b54] text-sm font-semibold"
          >
            View order history
          </Link>
        </div>
      </div>
    </div>
  );
}
