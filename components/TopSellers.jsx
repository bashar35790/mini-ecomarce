"use client";

import { useEffect, useState } from "react";
import CardCarousel from "./CardCarousel";

const TopSellers = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        const topCards = data.products.slice(0, 8).map((item, index) => ({
          id: `topseller-${item.id}-${index}`,
          image: item.image,
          text: item.text,
          price: `${item.price}`,
        }));
        setCards(topCards);
      });
  }, []);

  return <CardCarousel title="Top Sellers" cards={cards} />;
};

export default TopSellers;
