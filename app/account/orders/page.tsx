"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import {
  fetchMyOrders,
  type MyOrdersQuery,
  type OrdersPagination,
} from "@/lib/api/orderApi";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/OrderStatusBadge";
import type { Order, OrderStatus } from "@/types/order";

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

const STATUS_FILTERS: ("" | OrderStatus)[] = [
  "",
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AccountOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrdersPagination | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number, s: "" | OrderStatus) => {
    setLoading(true);
    try {
      const query: MyOrdersQuery = { page: p, limit: 10 };
      if (s) query.orderStatus = s;
      const data = await fetchMyOrders(query);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account/orders");
      return;
    }
    load(page, status);
  }, [authLoading, isAuthenticated, page, status, load, router]);
  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto my-12 px-4 text-gray-500">
        Checking your session...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Order History
      </h1>
      <p className="text-gray-600 mb-6">
        {pagination ? `${pagination.total} order(s)` : "Your past orders"}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => {
              setPage(1);
              setStatus(s);
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer ${
              status === s
                ? "bg-[#a91f64] text-white border-[#a91f64]"
                : "border-gray-300 text-gray-600 hover:border-[#a91f64]"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-700 mb-4">No orders yet</p>
          <Link
            href="/products"
            className="inline-block bg-[#a91f64] text-white px-5 py-2 rounded-md hover:bg-[#8a1b54]"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <span className="font-bold text-gray-900">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <OrderStatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div
                      key={`${item.productId}-${i}`}
                      className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white"
                    >
                      <Image
                        src={item.image || "/images/logo.png"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 flex-1 truncate">
                  {order.items.map((i) => i.title).join(", ")}
                </p>
                <span className="font-bold text-gray-900">
                  {money(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}