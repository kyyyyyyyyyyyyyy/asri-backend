import type { PRODUCT_STATUSES } from "../../shared/constants/status.constant.js";

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export type Product = {
  id: string;
  storeId: string;
  name: string;
  status: ProductStatus;
};
