"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearCart } from "@/lib/cartSlice";
import { refreshCartPrices } from "@/lib/accountSync";
import { store } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { syncCart } from "@/lib/api/cartApi";
import { createOrder, createPaymentIntent } from "@/lib/api/orderApi";
import type { Address } from "@/types/user";
import type { PaymentMethod } from "@/types/order";

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const EMPTY_ADDRESS: Address = {
  fullName: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Bangladesh",
};

type FieldErrors = Partial<Record<keyof Address, string>>;

const validateAddress = (a: Address): FieldErrors => {
  const errors: FieldErrors = {};
  if (a.fullName.trim().length < 2) errors.fullName = "Full name is required";
  if (a.phone.trim().length < 5) errors.phone = "Valid phone is required";
  if (a.streetAddress.trim().length < 5)
    errors.streetAddress = "Street address is required";
  if (a.city.trim().length < 2) errors.city = "City is required";
  if (a.state.trim().length < 2) errors.state = "State is required";
  if (a.postalCode.trim().length < 3) errors.postalCode = "Postal code required";
  if (a.country.trim().length < 2) errors.country = "Country is required";
  return errors;
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [couponCode, setCouponCode] = useState("");
  const [refreshing, setRefreshing] = useState(true);
  const [placing, setPlacing] = useState(false);

  // Guests and empty carts don't belong here.
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/checkout");
      return;
    }
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [authLoading, isAuthenticated, cartItems.length, router]);

  // Pre-fill name/phone from profile; refresh cart prices/stock on mount.
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
    refreshCartPrices(dispatch, store.getState).finally(() =>
      setRefreshing(false)
    );
  }, [dispatch, user]);

  const set = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Only backend-resolvable lines can be ordered.
  const orderable = useMemo(
    () =>
      cartItems.filter((item) => {
        const pid = item.productId ?? String(item.id);
        return OBJECT_ID_RE.test(pid);
      }),
    [cartItems]
  );

  const skipped = cartItems.length - orderable.length;

  const estimate = useMemo(
    () =>
      orderable.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
      ),
    [orderable]
  );

  const handlePlaceOrder = async () => {
    const fieldErrors = validateAddress(address);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      toast.error("Please complete the shipping address.");
      return;
    }
    if (orderable.length === 0) {
      toast.error("Your cart has no orderable items.");
      return;
    }

    setPlacing(true);
    try {
      // Reconcile one last time so the order payload matches live stock.
      const payload = orderable.map((item) => ({
        productId: item.productId ?? String(item.id),
        variantId: item.variantId,
        quantity: Math.max(1, item.quantity || 1),
      }));
      const synced = await syncCart(payload);
      const valid = new Set(
        synced.items
          .filter((s) => s.valid && s.availableQuantity > 0)
          .map((s) => `${s.productId}::${s.variantId ?? ""}`)
      );
      const finalItems = payload.filter((p) =>
        valid.has(`${p.productId}::${p.variantId ?? ""}`)
      );
      if (finalItems.length === 0) {
        toast.error("Items in your cart are no longer available.");
        setPlacing(false);
        return;
      }

      const order = await createOrder({
        items: finalItems,
        shippingAddress: {
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          streetAddress: address.streetAddress.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          postalCode: address.postalCode.trim(),
          country: address.country.trim(),
        },
        paymentMethod,
        couponCode: couponCode.trim() ? couponCode.trim().toUpperCase() : undefined,
      });

      // COD: done — clear cart and go to the receipt (Task 37 page).
      if (paymentMethod === "COD") {
        dispatch(clearCart());
        toast.success(`Order ${order.orderNumber} placed!`);
        router.push(`/orders/${order.id}`);
        return;
      }

      // Online payment: create the Stripe intent (Task 35), then hand off.
      await createPaymentIntent(order.id);
      dispatch(clearCart());
      toast.success(`Order ${order.orderNumber} created — complete payment.`);
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Could not place order. Please try again.";
      toast.error(message);
      setPlacing(false);
    }
  };
  if (authLoading || !isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto my-12 px-4 text-gray-500">
        Checking your session...
      </div>
    );
  }

  const inputCls = (bad?: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none ${
      bad
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#a91f64]"
    }`;

  return (
    <div className="w-full max-w-7xl mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Checkout
      </h1>
      <p className="text-gray-600 mb-6">
        Shipping, payment, and order review — prices are confirmed with the
        store when you place the order.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: address + payment */}
        <div className="w-full lg:w-2/3 space-y-6">
          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  value={address.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Jane Doe"
                  className={inputCls(errors.fullName)}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone
                </label>
                <input
                  value={address.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputCls(errors.phone)}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Street Address
                </label>
                <input
                  value={address.streetAddress}
                  onChange={(e) => set("streetAddress", e.target.value)}
                  placeholder="House, road, area"
                  className={inputCls(errors.streetAddress)}
                />
                {errors.streetAddress && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.streetAddress}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  City
                </label>
                <input
                  value={address.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Dhaka"
                  className={inputCls(errors.city)}
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  State
                </label>
                <input
                  value={address.state}
                  onChange={(e) => set("state", e.target.value)}
                  placeholder="Dhaka"
                  className={inputCls(errors.state)}
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Postal Code
                </label>
                <input
                  value={address.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)}
                  placeholder="1000"
                  className={inputCls(errors.postalCode)}
                />
                {errors.postalCode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Country
                </label>
                <input
                  value={address.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={inputCls(errors.country)}
                />
                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">{errors.country}</p>
                )}
              </div>
            </div>
          </section>
          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  { value: "COD", label: "Cash on Delivery", hint: "Pay when it arrives" },
                  { value: "STRIPE", label: "Card (Stripe)", hint: "Pay online now" },
                ] as { value: PaymentMethod; label: string; hint: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPaymentMethod(opt.value)}
                  className={`text-left border rounded-lg px-4 py-3 transition-colors cursor-pointer ${
                    paymentMethod === opt.value
                      ? "border-[#a91f64] ring-1 ring-[#a91f64] bg-pink-50/40"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="block font-semibold text-gray-800">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-gray-500">{opt.hint}</span>
                </button>
              ))}
            </div>
            {paymentMethod === "STRIPE" && (
              <p className="text-xs text-gray-500 mt-3">
                A Stripe payment intent is created after your order — you
                complete payment on the confirmation page.
              </p>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Coupon</h2>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="WELCOME10"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:border-[#a91f64]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Validated by the store at order time (min spend, expiry, usage
              limit).
            </p>
          </section>
        </div>

        {/* Right: summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-24">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {refreshing && (
              <p className="text-xs text-gray-500 mb-3">
                Confirming latest prices with the store...
              </p>
            )}
            <div className="space-y-3 max-h-64 overflow-auto mb-4">
              {orderable.map((item) => (
                <div key={`${item.id}-${item.variantId ?? ""}`} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title || item.text || "Product"}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.title || item.text}
                    </p>
                    <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm text-gray-700">
                    ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            {skipped > 0 && (
              <p className="text-xs text-amber-600 mb-3">
                {skipped} legacy item(s) can&apos;t be ordered online.
              </p>
            )}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Estimated subtotal</span>
                <span>${estimate.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Final total (discount, shipping, tax) is calculated by the
                store when you place the order.
              </p>
              <button
                onClick={handlePlaceOrder}
                disabled={placing || orderable.length === 0}
                className="w-full mt-2 bg-[#a91f64] text-white py-2.5 rounded-md hover:bg-[#8a1b54] disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold cursor-pointer"
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>
              <Link
                href="/cart"
                className="block text-center text-sm text-gray-500 hover:text-[#a91f64] mt-2"
              >
                Back to cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
