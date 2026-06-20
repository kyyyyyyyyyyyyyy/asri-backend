export type CreateCategoryDto = {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
};

export type CategoryQuery = {
  page?: number;
  limit?: number;
  search?: string;
}


export type UpdateCategoryDto = {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: string | null;
}