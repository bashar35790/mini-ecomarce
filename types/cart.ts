export interface CartItem {
  id: string | number;
  productId?: string;
  variantId?: string;
  text?: string;
  title?: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  inStock?: boolean;
  stockCount?: number;
  attributes?: Record<string, string>;
  sku?: string;
}

export interface CartState {
  items: CartItem[];
}
