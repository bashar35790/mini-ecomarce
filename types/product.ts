export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary?: boolean;
  order?: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  attributes: Record<string, string>;
  price: number;
  discountPrice?: number;
  stockCount: number;
  image?: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export type ProductStatus = "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK" | "ARCHIVED";

export interface Product {
  id: string | number;
  title?: string;
  text?: string;
  name?: string;
  slug?: string;
  sku?: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  category: string;
  categoryId?: string;
  price: number;
  discountPrice?: number;
  image: string;
  images?: ProductImage[] | string[];
  inStock: boolean;
  stockCount?: number;
  lowStockThreshold?: number;
  rating?: number;
  numReviews?: number;
  material?: string;
  roomType?: string;
  style?: string;
  quantity?: number;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  specifications?: Specification[];
  dimensions?: Dimensions;
  weightKg?: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isTopSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
