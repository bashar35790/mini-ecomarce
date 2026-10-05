import { Address } from "./user";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "COD" | "STRIPE" | "SSLCOMMERZ";

export interface OrderItem {
  productId: string;
  variantId?: string;
  title: string;
  sku?: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  attributes?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discountTotal?: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentRef?: string;
  trackingNumber?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNotes?: string;
}
