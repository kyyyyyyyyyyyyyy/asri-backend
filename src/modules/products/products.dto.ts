export type CreateProductDto = {
  storeId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
};
