"use client";

import React, { useMemo } from "react";
import type { BackendProductVariant } from "@/lib/api/productApi";

interface VariantSelectorProps {
  variants: BackendProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: BackendProductVariant) => void;
}

const COLOR_HINTS = ["color", "colour", "shade", "finish"];

const looksLikeColorAttr = (name: string): boolean =>
  COLOR_HINTS.some((hint) => name.toLowerCase().includes(hint));

const colorDotStyle = (value: string): React.CSSProperties => {
  const normalized = value.trim().toLowerCase();
  // Only use the raw value if it is a safe CSS color token.
  if (/^[a-z]+$/.test(normalized) || /^#[0-9a-f]{3,8}$/.test(normalized)) {
    return { backgroundColor: normalized };
  }
  return { backgroundColor: "#9ca3af" };
};

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariantId,
  onSelect,
}) => {
  const selected = variants.find((v) => v.id === selectedVariantId) ?? null;

  const attributeNames = useMemo(() => {
    const names: string[] = [];
    for (const variant of variants) {
      for (const key of Object.keys(variant.attributes || {})) {
        if (!names.includes(key)) names.push(key);
      }
    }
    return names;
  }, [variants]);

  const valuesFor = (name: string): string[] => {
    const selectedAttrs = selected?.attributes || {};
    const values: string[] = [];
    for (const variant of variants) {
      // Only offer values compatible with the other selected attributes,
      // so every pill leads to a real variant.
      const compatible = Object.entries(selectedAttrs).every(
        ([key, val]) => key === name || variant.attributes?.[key] === val
      );
      if (!compatible) continue;
      const value = variant.attributes?.[name];
      if (value !== undefined && !values.includes(value)) values.push(value);
    }
    return values;
  };

  const pick = (name: string, value: string) => {
    const selectedAttrs = selected?.attributes || {};
    const target = variants.find((variant) =>
      Object.entries({ ...selectedAttrs, [name]: value }).every(
        ([key, val]) => variant.attributes?.[key] === val
      )
    );
    if (target) onSelect(target);
  };

  if (variants.length === 0 || attributeNames.length === 0) return null;

  return (
    <div className="space-y-4">
      {attributeNames.map((name) => {
        const activeValue = selected?.attributes?.[name];
        const isColor = looksLikeColorAttr(name);
        return (
          <div key={name}>
            <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
              {name}
              {activeValue && (
                <span className="ml-2 font-normal text-gray-500">
                  {activeValue}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {valuesFor(name).map((value) => {
                const active = activeValue === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => pick(name, value)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-green-600 bg-green-50 text-green-700 font-semibold"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {isColor && (
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300"
                        style={colorDotStyle(value)}
                      />
                    )}
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {selected && (
        <p className="text-xs text-gray-500">
          Selected: {selected.title} · SKU {selected.sku}
        </p>
      )}
    </div>
  );
};

export default VariantSelector;
