import type { ORDER_STATUSES } from "../../shared/constants/status.constant.js";

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  buyerId: string;
  status: OrderStatus;
  totalAmount: number;
};
