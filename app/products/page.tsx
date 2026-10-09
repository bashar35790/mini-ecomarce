"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import {
  fetchProducts,
  fetchCategories,
  type BackendProduct,
  type ProductSort,
} from "@/lib/api/productApi";
import type { Category } from "@/types/category";

const PAGE_LIMIT = 9;

const PRICE_PRESETS: Record<string, { minPrice?: number; maxPrice?: number }> = {
  "$0 - $100": { maxPrice: 100 },
  "$100 - $300": { minPrice: 100, maxPrice: 300 },
  "$300+": { minPrice: 300 },
};

const getCardImage = (product: BackendProduct): string => {
  const primary = product.images?.find((img) => img.isPrimary)?.url;
  if (primary) return primary;
  if (product.images?.length) return product.images[0].url;
  return "/images/logo.png";
};

const getEffectivePrice = (product: BackendProduct): number =>
  product.discountPrice ?? product.basePrice;

const Products = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pricePreset, setPricePreset] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [brand, setBrand] = useState("");
  const [sortOrder, setSortOrder] = useState<ProductSort>("newest");
  const [page, setPage] = useState(1);

  // Debounce search input (~400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load categories once (drives the category filter for all verticals)
  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((cats) => {
        if (!cancelled) setCategories(cats);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const priceRange = PRICE_PRESETS[pricePreset];
      const data = await fetchProducts({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        category: category !== "all" ? category : undefined,
        minPrice: priceRange?.minPrice,
        maxPrice: priceRange?.maxPrice,
        brand: brand.trim() || undefined,
        inStock: inStockOnly || undefined,
        sort: sortOrder,
      });
      setProducts(data.products);
      setTotal(data.pagination.total);
      setTotalPages(Math.max(1, data.pagination.totalPages));
    } catch {
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, pricePreset, brand, inStockOnly, sortOrder]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const resetPage = () => setPage(1);

  const hasActiveFilters =
    category !== "all" ||
    pricePreset !== "all" ||
    inStockOnly ||
    brand.trim() !== "" ||
    search !== "";

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("all");
    setPricePreset("all");
    setInStockOnly(false);
    setBrand("");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Products</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products, brands..."
          className="w-full md:w-1/2 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-1/4 bg-white p-6 rounded-lg shadow h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Filters</h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-green-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category (dynamic, all verticals) */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Category</h4>
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={category === "all"}
                onChange={() => {
                  setCategory("all");
                  resetPage();
                }}
              />
              All Categories
            </label>
            {categories.map((cat) => (
              <label
                key={cat.slug}
                className="flex items-center gap-2 mb-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  checked={category === cat.slug}
                  onChange={() => {
                    setCategory(cat.slug);
                    resetPage();
                  }}
                />
                {cat.name}
              </label>
            ))}
          </div>

          {/* Price */}
          <FilterGroup
            title="Price Range"
            options={["$0 - $100", "$100 - $300", "$300+"]}
            selected={pricePreset === "all" ? [] : [pricePreset]}
            onChange={(v) => {
              setPricePreset((prev) => (prev === v ? "all" : v));
              resetPage();
            }}
          />

          {/* Availability */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Availability</h4>
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => {
                  setInStockOnly((prev) => !prev);
                  resetPage();
                }}
              />
              In Stock only
            </label>
          </div>

          {/* Brand */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Brand</h4>
            <input
              type="text"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                resetPage();
              }}
              placeholder="e.g. Sony"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </aside>

        {/* Product Section */}
        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Products ({loading ? "..." : total})
            </h2>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as ProductSort);
                resetPage();
              }}
              className="border rounded px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm overflow-hidden h-[340px] animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow p-10 text-center">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                type="button"
                onClick={loadProducts}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-10 text-center">
              <p className="text-gray-600 font-medium mb-2">No products found</p>
              <p className="text-sm text-gray-400 mb-4">
                Try adjusting your filters or search.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-green-600 hover:underline text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={getCardImage(product)}
                    text={product.title}
                    title={product.title}
                    price={getEffectivePrice(product)}
                    category={product.category?.name ?? "General"}
                    inStock={product.stockCount > 0}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border rounded-lg px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="border rounded-lg px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;

/* ---------- Reusable Filter Group ---------- */

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (opt: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  options,
  selected,
  onChange,
}) => (
  <div className="mb-6">
    <h4 className="font-medium mb-2">{title}</h4>
    {options.map((opt) => (
      <label key={opt} className="flex items-center gap-2 mb-1 cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes(opt)}
          onChange={() => onChange(opt)}
        />
        {opt}
      </label>
    ))}
  </div>
);
