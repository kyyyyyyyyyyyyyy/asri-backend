export type CreateOrderDto = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};
