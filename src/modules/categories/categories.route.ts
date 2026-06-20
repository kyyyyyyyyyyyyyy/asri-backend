import { Hono } from "hono";

import { validateBody } from "../../shared/middleware/validation.middleware.js";

import { CategoriesHandler } from "./categories.handler.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./categories.validation.js";

export const categoriesRoutes =
  new Hono();

const categoriesHandler =
  new CategoriesHandler();

categoriesRoutes.get(
  "/",
  categoriesHandler.getCategories
);

categoriesRoutes.get(
  "/root",
  categoriesHandler.getRootCategories
);

categoriesRoutes.get(
  "/slug/:slug",
  categoriesHandler.getCategoryBySlug
);

categoriesRoutes.get(
  "/:id",
  categoriesHandler.getCategoryById
);

categoriesRoutes.get(
  "/:id/children",
  categoriesHandler.getCategoryChildren
);

categoriesRoutes.post(
  "/",
  validateBody(
    createCategorySchema
  ),
  categoriesHandler.createCategory
);

categoriesRoutes.patch(
  "/:id",
  validateBody(
    updateCategorySchema
  ),
  categoriesHandler.updateCategory
);

categoriesRoutes.patch(
  "/:id/restore",
  categoriesHandler.restoreCategory
);

categoriesRoutes.delete(
  "/:id",
  categoriesHandler.deleteCategory
);

categoriesRoutes.delete(
  "/:id/hard",
  categoriesHandler.hardDeleteCategory
);

// note: belum pake middleware tapi semua endpoint berjalan