"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaShoppingCart, FaStar, FaMinus, FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@/lib/hooks";
import { addToCart } from "@/lib/cartSlice";
import VariantSelector from "@/components/VariantSelector";
import {
  fetchProductBySlug,
  type BackendProduct,
  type BackendProductVariant,
} from "@/lib/api/productApi";

const FALLBACK_IMAGE = "/images/logo.png";

const ProductDetails = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>(FALLBACK_IMAGE);
  const [selectedVariant, setSelectedVariant] =
    useState<BackendProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProductBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        const primary =
          data.images?.find((img) => img.isPrimary)?.url ??
          data.images?.[0]?.url ??
          FALLBACK_IMAGE;
        setActiveImage(primary);
        const firstVariant =
          data.hasVariants && data.variants?.length
            ? data.variants[0]
            : null;
        setSelectedVariant(firstVariant);
        setQuantity(1);
      })
      .catch(() => {
        if (!cancelled) setError("Product not found or failed to load.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const images = useMemo(() => {
    if (!product?.images?.length) return [FALLBACK_IMAGE];
    return product.images.map((img) => img.url);
  }, [product]);

  // Prefer the selected variant's image when it has one.
  useEffect(() => {
    if (selectedVariant?.image) setActiveImage(selectedVariant.image);
  }, [selectedVariant]);

  const unitPrice = selectedVariant
    ? (selectedVariant.discountPrice ?? selectedVariant.price)
    : (product?.discountPrice ?? product?.basePrice ?? 0);
  const originalPrice = selectedVariant
    ? selectedVariant.discountPrice != null
      ? selectedVariant.price
      : null
    : product?.discountPrice != null
      ? product.basePrice
      : null;

  const availableStock = selectedVariant
    ? selectedVariant.stockCount
    : (product?.stockCount ?? 0);
  const lowThreshold = product?.lowStockThreshold ?? 5;
  const outOfStock = availableStock <= 0;
  const lowStock = !outOfStock && availableStock <= lowThreshold;

  const handleAddToCart = () => {
    if (!product || outOfStock) return;
    const qty = Math.min(Math.max(1, quantity), availableStock);
    dispatch(
      addToCart({
        id: product.id,
        productId: product.id,
        variantId: selectedVariant?.id,
        title: product.title,
        text: product.title,
        price: unitPrice,
        image: selectedVariant?.image ?? activeImage,
        quantity: qty,
        category: product.category?.name,
        inStock: true,
        stockCount: availableStock,
        attributes: selectedVariant?.attributes,
        sku: selectedVariant?.sku ?? product.sku,
      })
    );
    toast.success(
      selectedVariant
        ? `Added ${qty} × ${product.title} (${selectedVariant.title})`
        : `Added ${qty} × ${product.title}`,
      { duration: 2000, position: "bottom-center" }
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto my-12 px-4 grid md:grid-cols-2 gap-10 animate-pulse">
        <div>
          <div className="w-full h-96 bg-gray-200 rounded-xl" />
          <div className="flex gap-3 mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto my-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-3">Product not found</h1>
        <p className="text-gray-500 mb-6">
          {error ?? "This product may have been removed."}
        </p>
        <Link
          href="/products"
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-12 px-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative w-full h-96 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === src
                      ? "border-green-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${product.title} view ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            {product.brand && (
              <span className="uppercase tracking-wider text-gray-400 font-semibold">
                {product.brand}
              </span>
            )}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-green-600 hover:underline"
              >
                {product.category.name}
              </Link>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <FaStar /> {product.rating?.toFixed(1) ?? "0.0"}
            </span>
            <span className="text-gray-400">
              ({product.numReviews ?? 0} reviews)
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">SKU {product.sku}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-gray-900">
              ${unitPrice.toFixed(2)}
            </span>
            {originalPrice != null && (
              <span className="text-lg text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock badge */}
          <div className="mt-3">
            {outOfStock ? (
              <span className="inline-block bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            ) : lowStock ? (
              <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
                Low Stock — only {availableStock} left
              </span>
            ) : (
              <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                In Stock
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-gray-600 mt-4">{product.shortDescription}</p>
          )}

          {/* Variants */}
          {product.hasVariants &&
            product.variants &&
            product.variants.length > 0 && (
              <div className="mt-6">
                <VariantSelector
                  variants={product.variants}
                  selectedVariantId={selectedVariant?.id ?? null}
                  onSelect={(v) => {
                    setSelectedVariant(v);
                    setQuantity(1);
                  }}
                />
              </div>
            )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-lg">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                className="p-3 text-gray-600 disabled:opacity-40"
              >
                <FaMinus />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  setQuantity((q) => Math.min(availableStock, q + 1))
                }
                disabled={outOfStock || quantity >= availableStock}
                className="p-3 text-gray-600 disabled:opacity-40"
              >
                <FaPlus />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FaShoppingCart />
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* Meta */}
          <dl className="grid grid-cols-2 gap-2 mt-6 text-sm">
            <dt className="text-gray-400">SKU</dt>
            <dd className="text-gray-800">
              {selectedVariant?.sku ?? product.sku}
            </dd>
            <dt className="text-gray-400">Category</dt>
            <dd className="text-gray-800">{product.category?.name}</dd>
            {product.brand && (
              <>
                <dt className="text-gray-400">Brand</dt>
                <dd className="text-gray-800">{product.brand}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Description + specs */}
      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <div>
          <h2 className="text-xl font-bold mb-3">Description</h2>
          <p className="text-gray-600 whitespace-pre-line">
            {product.description}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3">Specifications</h2>
          {product.specifications && product.specifications.length > 0 ? (
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                {product.specifications.map((spec) => (
                  <tr key={spec.key} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2.5 bg-gray-50 font-medium text-gray-700 w-1/3">
                      {spec.key}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">
              No specifications listed for this product.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
