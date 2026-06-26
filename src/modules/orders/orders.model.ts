import type { ORDER_STATUSES } from "../../shared/constants/status.constant.js";

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
};

export type Order = {
  id: string;
  buyerId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
};
