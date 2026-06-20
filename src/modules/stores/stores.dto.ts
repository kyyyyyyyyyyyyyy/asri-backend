export type CreateStoreDto = {
  name: string;
  description: string;
  address: string;
};

export type UpdateStoreDto = Partial<CreateStoreDto> & {
  is_active?: boolean;
};
