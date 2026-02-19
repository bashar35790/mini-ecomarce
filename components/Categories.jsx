"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
  }, []);

  return (
    <div className="mx-auto my-8 grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
      {categories.map((category, index) => (
        <div
          key={index}
          className="group relative flex h-80 w-full flex-col justify-end overflow-hidden rounded-2xl"
        >
          <Image
            src={category.image}
            sizes="100"
            fill
            alt="diee"
            style={{ objectFit: "cover" }}
            className="z-0 transition transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 pb-6 text-center">
            <Link href="/products">
              <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black shadow-md cursor-pointer hover:bg-[#a91f64] hover:text-white transition-colors">
                {category.buttonText}
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
