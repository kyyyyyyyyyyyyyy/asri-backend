export const ORDER_STATUSES = ["pending", "processing", "shipped", "completed", "cancelled"] as const;
export const TRANSACTION_STATUSES = ["unpaid", "paid", "failed", "refunded"] as const;
export const SHIPMENT_TYPES = ["economy", "express"] as const;
export const SHIPMENT_STATUSES = ["waiting", "picked_up", "on_delivery", "delivered"] as const;
export const PRODUCT_STATUSES = ["draft", "pending_validation", "approved", "rejected", "inactive"] as const;
