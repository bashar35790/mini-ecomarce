"use client";

import React, { useEffect, useState } from "react";
import CardCarousel from "./CardCarousel";

const NewArrivals = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        const sliced = data.products.slice(0, 8).map((item) => ({
          id: item.id,
          image: item.image,
          text: item.text,
          price: item.price,
          category: item.category,
          inStock: item.inStock,
        }));
        setCards(sliced);
      });
  }, []);

  return (
    <div>
      <CardCarousel title="New Arrivals" cards={cards} />
    </div>
  );
};

export default NewArrivals;
