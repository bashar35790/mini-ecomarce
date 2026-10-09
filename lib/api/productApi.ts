import apiClient from "./client";
import type { Category } from "@/types/category";

export interface BackendProductImage {
  url: string;
  publicId?: string | null;
  alt?: string | null;
  isPrimary?: boolean;
  order?: number;
}

export interface BackendProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BackendProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  brand?: string | null;
  description: string;
  shortDescription?: string | null;
  category: BackendProductCategory;
  categoryId: string;
  basePrice: number;
  discountPrice?: number | null;
  images: BackendProductImage[];
  stockCount: number;
  lowStockThreshold: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  isNewArrival: boolean;
  isTopSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductSort =
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating-desc";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string; // category slug or id
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sort?: ProductSort;
}

export interface ProductsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: BackendProduct[];
  pagination: ProductsPagination;
}

const cleanParams = (params: ProductQueryParams): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    cleaned[key] = value;
  }
  return cleaned;
};

export const fetchProducts = async (
  params: ProductQueryParams = {}
): Promise<ProductsResponse> => {
  const response = await apiClient.get<{
    status: string;
    data: ProductsResponse;
  }>("/products", { params: cleanParams(params) });
  return response.data.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<{
    status: string;
    data: { categories: Category[] };
  }>("/categories");
  return response.data.data.categories;
};

export const fetchProductBySlug = async (
  slug: string
): Promise<BackendProduct> => {
  const response = await apiClient.get<{
    status: string;
    data: { product: BackendProduct };
  }>(`/products/${slug}`);
  return response.data.data.product;
};
