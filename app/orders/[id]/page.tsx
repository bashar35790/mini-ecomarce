"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import { fetchOrderById } from "@/lib/api/orderApi";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  TRACKING_STEPS,
} from "@/components/OrderStatusBadge";
import type { Order } from "@/types/order";

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=/orders/${id}`);
      return;
    }
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetchOrderById(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err: any) => {
        if (cancelled) return;
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error(
            err.response?.data?.message || "Could not load this order."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, id, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          Loading your order...
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order not found
          </h1>
          <p className="text-gray-500 mb-6">
            This order doesn&apos;t exist or belongs to another account.
          </p>
          <Link
            href="/account/orders"
            className="inline-block bg-[#a91f64] text-white px-5 py-2 rounded-md hover:bg-[#8a1b54]"
          >
            View my orders
          </Link>
        </div>
      </div>
    );
  }

  const stepIndex = TRACKING_STEPS.indexOf(order.orderStatus);
  const isTerminal =
    order.orderStatus === "CANCELLED" || order.orderStatus === "REFUNDED";

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6 text-center">
        <h1 className="text-2xl font-bold text-green-800">
          Thank you — order {order.orderNumber} confirmed
        </h1>
        <p className="text-sm text-green-700 mt-1">
          Placed {new Date(order.createdAt).toLocaleString()} ·{" "}
          {order.paymentMethod === "COD"
            ? "Pay on delivery"
            : `Online payment (${order.paymentStatus})`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <OrderStatusBadge status={order.orderStatus} />
        <PaymentStatusBadge status={order.paymentStatus} />
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
          {order.paymentMethod}
        </span>
        {order.trackingNumber && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            Tracking: {order.trackingNumber}
          </span>
        )}
      </div>

      {/* Tracking stepper */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Tracking</h2>
        {isTerminal ? (
          <p className="text-sm text-gray-600">
            This order was {order.orderStatus.toLowerCase()}. Contact support
            if you need help.
          </p>
        ) : (
          <ol className="flex items-center">
            {TRACKING_STEPS.map((step, i) => {
              const done = stepIndex >= 0 && i <= stepIndex;
              const current = stepIndex >= 0 && i === stepIndex;
              return (
                <li key={step} className="flex-1 flex items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        done ? "bg-[#a91f64] text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-[11px] mt-1 font-medium ${
                        current ? "text-[#a91f64]" : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < TRACKING_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 mb-5 ${
                        stepIndex > i ? "bg-[#a91f64]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {/* Items */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Items ({order.items.reduce((n, i) => n + i.quantity, 0)})
        </h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={`${item.productId}-${item.variantId ?? ""}-${idx}`} className="flex gap-4 items-center">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src={item.image || "/images/logo.png"}
                  alt={item.title}
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {item.sku} · Qty {item.quantity} · {money(item.unitPrice)} each
                </p>
              </div>
              <span className="font-semibold text-gray-800">
                {money(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals + address */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-3">Summary</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Subtotal</dt>
              <dd>{money(order.subtotal)}</dd>
            </div>
            {(order.discountTotal ?? 0) > 0 && (
              <div className="flex justify-between text-green-700">
                <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
                <dd>-{money(order.discountTotal ?? 0)}</dd>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <dt>Shipping</dt>
              <dd>{money(order.shippingFee)}</dd>
            </div>
            <div className="flex justify-between text-gray-600">
              <dt>Tax</dt>
              <dd>{money(order.tax)}</dd>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t pt-2 text-base">
              <dt>Total</dt>
              <dd>{money(order.total)}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-3">Ship To</h2>
          <p className="text-sm text-gray-800 font-medium">
            {order.shippingAddress.fullName}
          </p>
          <p className="text-sm text-gray-600">{order.shippingAddress.streetAddress}</p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>
          <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
          <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.phone}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/account/orders"
          className="bg-[#a91f64] text-white px-5 py-2 rounded-md hover:bg-[#8a1b54] text-sm font-semibold"
        >
          View all orders
        </Link>
        <Link
          href="/products"
          className="border border-gray-300 px-5 py-2 rounded-md text-sm font-semibold text-gray-700"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
