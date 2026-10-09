"use client";

import React from "react";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import AuthInitializer from "./AuthInitializer";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
