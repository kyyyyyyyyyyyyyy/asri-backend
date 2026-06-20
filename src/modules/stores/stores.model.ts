export type Store = {
  id: string;
  sellerId: string;
  name: string;
  description: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
