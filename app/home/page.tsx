import { Categories } from "@/components/Categories";
import NewArrivals from "@/components/NewArrivals";
import { SiderComponent } from "@/components/SiderComponent";
import TopSellers from "@/components/TopSellers";
import React from "react";

export default function HomePage() {
  return (
    <main>
      <SiderComponent />
      <Categories />
      <NewArrivals />
      <TopSellers />
    </main>
  );
}
