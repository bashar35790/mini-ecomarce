import apiClient from "./client";

export interface BackendWishlistProduct {
  id: string;
  title: string;
  slug: string;
  brand?: string | null;
  basePrice: number;
  discountPrice?: number | null;
  images: Array<{ url: string; isPrimary?: boolean }>;
  stockCount: number;
  rating: number;
  numReviews: number;
  category?: { id: string; name: string; slug: string } | null;
}

export interface ToggleWishlistResult {
  productId: string;
  wishlisted: boolean;
  wishlistCount: number;
}

export const fetchWishlist = async (): Promise<BackendWishlistProduct[]> => {
  const response = await apiClient.get<{
    status: string;
    data: { products: BackendWishlistProduct[]; count: number };
  }>("/wishlist");
  return response.data.data.products;
};

export const toggleWishlist = async (
  productId: string
): Promise<ToggleWishlistResult> => {
  const response = await apiClient.post<{
    status: string;
    data: ToggleWishlistResult;
  }>(`/wishlist/${productId}`);
  return response.data.data;
};
