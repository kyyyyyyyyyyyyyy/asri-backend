import type { PRODUCT_STATUSES } from "../../shared/constants/status.constant.js";

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export type ProductImage = {
  id: string;

  productId: string;

  imageUrl: string;

  sortOrder: number;

  createdAt: Date;
};

export type Product = {
  id: string;

  storeId: string;

  categoryId: string | null;

  name: string;

  description: string | null;

  price: number;

  stock: number;

  status: ProductStatus;

  images: ProductImage[];

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
};