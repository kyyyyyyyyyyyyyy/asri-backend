export type CreateCategoryDto = {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
};
