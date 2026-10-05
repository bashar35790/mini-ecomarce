"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import data from "@/public/data/data.json";
import { Product } from "@/types/product";

interface FiltersState {
  category: string[];
  priceRange: string[];
  availability: string[];
  material: string[];
  roomType: string[];
  style: string[];
}

const Products = () => {
  const [sortOrder, setSortOrder] = useState<string>("default");

  const [filters, setFilters] = useState<FiltersState>({
    category: [],
    priceRange: [],
    availability: [],
    material: [],
    roomType: [],
    style: [],
  });

  const handleFilterChange = (type: keyof FiltersState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const priceRangeMap: Record<string, (price: number) => boolean> = {
    "$0 - $100": (price) => price <= 100,
    "$100 - $300": (price) => price > 100 && price <= 300,
    "$300+": (price) => price > 300,
  };

  const filteredProducts = useMemo(() => {
    const productsList = data.products as unknown as Product[];
    return productsList.filter((product) => {
      return (
        (!filters.category.length ||
          filters.category.includes(product.category)) &&
        (!filters.priceRange.length ||
          filters.priceRange.some((r) => priceRangeMap[r]?.(product.price))) &&
        (!filters.availability.length ||
          filters.availability.includes(
            product.inStock ? "In Stock" : "Out of Stock",
          )) &&
        (!filters.material.length ||
          (product.material && filters.material.includes(product.material))) &&
        (!filters.roomType.length ||
          (product.roomType && filters.roomType.includes(product.roomType))) &&
        (!filters.style.length ||
          (product.style && filters.style.includes(product.style)))
      );
    });
  }, [filters]);

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];

    switch (sortOrder) {
      case "price-low":
        return items.sort((a, b) => a.price - b.price);
      case "price-high":
        return items.sort((a, b) => b.price - a.price);
      case "name":
        return items.sort((a, b) => (a.text || "").localeCompare(b.text || ""));
      default:
        return items;
    }
  }, [filteredProducts, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Products</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-1/4 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Filters</h3>

          {/* Category */}
          <FilterGroup
            title="Category"
            options={["Clothing", "Electronics", "Toys", "Furniture"]}
            selected={filters.category}
            onChange={(v) => handleFilterChange("category", v)}
          />

          {/* Price */}
          <FilterGroup
            title="Price Range"
            options={["$0 - $100", "$100 - $300", "$300+"]}
            selected={filters.priceRange}
            onChange={(v) => handleFilterChange("priceRange", v)}
          />

          {/* Availability */}
          <FilterGroup
            title="Availability"
            options={["In Stock", "Out of Stock"]}
            selected={filters.availability}
            onChange={(v) => handleFilterChange("availability", v)}
          />

          {/* Material */}
          <FilterGroup
            title="Material"
            options={["Wood", "Metal", "Fabric", "Leather", "Glass", "Rattan"]}
            selected={filters.material}
            onChange={(v) => handleFilterChange("material", v)}
          />
        </aside>

        {/* Product Section */}
        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Products ({sortedProducts.length})
            </h2>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="default">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                text={product.text || product.title || ""}
                price={product.price}
                category={product.category}
                inStock={product.inStock}
              />
            ))}
          </div>
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
