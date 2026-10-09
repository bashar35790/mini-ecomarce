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
  price: p.discountPrice ?? p.basePrice,
  category: p.category?.name ?? "General",
  inStock: p.stockCount > 0,
  slug: p.slug,
});

const TopSellers: React.FC = () => {
  const [cards, setCards] = useState<CarouselCard[]>([]);

  // Task 32: live backend ids keep wishlist/cart sync resolvable.
  useEffect(() => {
    let cancelled = false;
    fetchProducts({ limit: 8 })
      .then((res) => {
        if (cancelled) return;
        const top = [...res.products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        setCards(top.map(toCard));
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

  return <CardCarousel title="Top Sellers" cards={cards} />;
};

export default TopSellers;
