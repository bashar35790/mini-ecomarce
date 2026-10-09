import apiClient from "./client";
import type {
  CreateOrderPayload,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/order";

export interface PaymentIntentResponse {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentRef: string;
  clientSecret: string | null;
  mode: "stripe" | "mock";
}

export interface OrdersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MyOrdersQuery {
  page?: number;
  limit?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const response = await apiClient.post<{
    status: string;
    data: { order: Order };
  }>("/orders", payload);
  return response.data.data.order;
};

export const fetchMyOrders = async (
  query: MyOrdersQuery = {}
): Promise<{ orders: Order[]; pagination: OrdersPagination }> => {
  const response = await apiClient.get<{
    status: string;
    data: { orders: Order[]; pagination: OrdersPagination };
  }>("/orders/my-orders", { params: query });
  return response.data.data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get<{
    status: string;
    data: { order: Order };
  }>(`/orders/${id}`);
  return response.data.data.order;
};

export const createPaymentIntent = async (
  orderId: string
): Promise<PaymentIntentResponse> => {
  const response = await apiClient.post<{
    status: string;
    data: PaymentIntentResponse;
  }>("/payments/create-intent", { orderId });
  return response.data.data;
};

export type { PaymentMethod };
