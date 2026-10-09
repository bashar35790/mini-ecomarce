import apiClient from "./client";

export interface CartSyncPayloadItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface SyncedCartItem {
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  image: string | null;
  attributes?: Record<string, string> | null;
  unitPrice: number;
  requestedQuantity: number;
  availableQuantity: number;
  inStock: boolean;
  valid: boolean;
  message?: string;
}

export interface CartSyncSummary {
  validItemCount: number;
  totalQuantity: number;
  subtotal: number;
}

export interface CartSyncResult {
  items: SyncedCartItem[];
  summary: CartSyncSummary;
}

export const syncCart = async (
  items: CartSyncPayloadItem[]
): Promise<CartSyncResult> => {
  const response = await apiClient.post<{
    status: string;
    data: CartSyncResult;
  }>("/cart/sync", { items });
  return response.data.data;
};
