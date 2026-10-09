"use client";

import React, { useEffect, useState } from "react";
import CardCarousel, { type CarouselCard } from "./CardCarousel";
import { fetchProducts, type BackendProduct } from "@/lib/api/productApi";

const FALLBACK_IMAGE = "/images/logo.png";

const toCard = (p: BackendProduct): CarouselCard => ({
  id: p.id,
  productId: p.id,
  image:
    p.images?.find((img) => img.isPrimary)?.url ??
    p.images?.[0]?.url ??
    FALLBACK_IMAGE,
  text: p.title,
  title: p.title,
  // Prefer the live store price so cart sync never sees a stale value.
  price: p.discountPrice ?? p.basePrice,
  category: p.category?.name ?? "General",
  inStock: p.stockCount > 0,
  slug: p.slug,
});

const NewArrivals: React.FC = () => {
  const [cards, setCards] = useState<CarouselCard[]>([]);

  // Task 32: use live backend ids/prices so login cart-merge + wishlist
  // push can resolve every card. Falls back to legacy static data offline.
  useEffect(() => {
    let cancelled = false;
    fetchProducts({ limit: 8, sort: "newest" })
      .then((res) => {
        if (!cancelled) setCards(res.products.map(toCard));
      })
      .catch(() => {
        fetch("/data/data.json")
          .then((res) => res.json())
          .then((data) => {
            if (cancelled) return;
            setCards(
              (data.products ?? []).slice(0, 8).map((item: CarouselCard) => ({
                ...item,
              }))
            );
          })
          .catch(() => {});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <CardCarousel title="New Arrivals" cards={cards} />
    </div>
  );
};

export default NewArrivals;
