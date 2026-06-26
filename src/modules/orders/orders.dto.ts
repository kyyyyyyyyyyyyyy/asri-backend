import type { Order, OrderStatus } from "./orders.model.js";

export type CreateOrderItemDto = {
  product_id: string;
  quantity: number;
};

export type CreateOrderDto = {
  buyer_id: string;
  items: CreateOrderItemDto[];
};

export type CreateOrderResult = {
  order: Order;
  snapToken: string | null;
};

export type OrderQuery = {
  page?: number;
  limit?: number;
  buyer_id?: string;
  status?: OrderStatus;
};