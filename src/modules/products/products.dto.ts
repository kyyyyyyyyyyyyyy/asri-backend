import type {
  ProductStatus,
} from "./products.model.js";

export type CreateProductImageDto = {
  image_url: string;

  sort_order?: number;
};

export type CreateProductDto = {
  store_id: string;

  category_id?: string | null;

  name: string;

  description?: string;

  price: number;

  stock?: number;

  images?: CreateProductImageDto[];
};

export type UpdateProductDto = {
  category_id?: string | null;

  name?: string;

  description?: string;

  price?: number;

  stock?: number;

  status?: ProductStatus;
};

export type ProductQuery = {
  search?: string;

  store_id?: string;

  category_id?: string;

  status?: ProductStatus;
};