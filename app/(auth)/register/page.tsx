"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
} from "react-icons/fa";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials } from "@/lib/authSlice";
import { store } from "@/lib/store";
import { syncOnLogin } from "@/lib/accountSync";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/home";
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await apiClient.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const { user, accessToken } = response.data.data;
      dispatch(setCredentials({ user, accessToken }));

      // Task 32: merge any guest cart/wishlist into the new account.
      syncOnLogin(dispatch, store.getState).catch(() => {});

      toast.success(`Welcome to Sopifest, ${user.name}!`);
      router.push(redirectUrl);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-semibold tracking-wider text-[#a91f64] uppercase bg-pink-50 px-3 py-1 rounded-full mb-3">
          Join Sopifest
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Experience seamless shopping across multi-category essentials
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FaUser className="text-sm" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Sarah Johnson"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.name
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-gray-200 focus:border-[#a91f64] focus:ring-1 focus:ring-[#a91f64]"
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FaEnvelope className="text-sm" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="sarah@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-gray-200 focus:border-[#a91f64] focus:ring-1 focus:ring-[#a91f64]"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FaLock className="text-sm" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="At least 8 characters"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.password
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-gray-200 focus:border-[#a91f64] focus:ring-1 focus:ring-[#a91f64]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-sm" />
              ) : (
                <FaEye className="text-sm" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FaLock className="text-sm" />
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Repeat your password"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-gray-200 focus:border-[#a91f64] focus:ring-1 focus:ring-[#a91f64]"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full pt-3 pb-3 px-4 rounded-xl bg-[#a91f64] hover:bg-[#8b1a53] text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-4"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            <>
              Create Account <FaUserPlus className="text-xs" />
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-bold text-[#a91f64] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div className="text-gray-500">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
