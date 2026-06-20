import type { Context } from "hono";

import {
  successResponse,
  errorResponse,
} from "../../shared/utils/response.js";

import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQuery,
} from "./categories.dto.js";

import { CategoriesService } from "./categories.service.js";

function getCategoryId(c: Context) {
  return c.req.param("id");
}

export class CategoriesHandler {
  constructor(
    private readonly categoriesService =
      new CategoriesService()
  ) {}

  getCategories = async (c: Context) => {
    const query: CategoryQuery = {
      page: Number(c.req.query("page")) || 1,
      limit: Number(c.req.query("limit")) || 10,
      search: c.req.query("search"),
    };

    const categories =
      await this.categoriesService.getCategories(
        query
      );

    return c.json(
      successResponse(
        "Categories retrieved",
        categories
      )
    );
  };

  getCategoryById = async (c: Context) => {
    const id = getCategoryId(c);

    if (!id) {
      return c.json(
        errorResponse(
          "Category id is required"
        ),
        400
      );
    }

    const category =
      await this.categoriesService.getCategoryById(
        id
      );

    if (!category) {
      return c.json(
        errorResponse(
          "Category not found"
        ),
        404
      );
    }

    return c.json(
      successResponse(
        "Category retrieved",
        {
          data: category,
        }
      )
    );
  };

  getCategoryBySlug = async (
    c: Context
  ) => {
    const slug =
      c.req.param("slug");

    if (!slug) {
      return c.json(
        errorResponse(
          "Category slug is required"
        ),
        400
      );
    }

    const category =
      await this.categoriesService.getCategoryBySlug(
        slug
      );

    if (!category) {
      return c.json(
        errorResponse(
          "Category not found"
        ),
        404
      );
    }

    return c.json(
      successResponse(
        "Category retrieved",
        {
          data: category,
        }
      )
    );
  };

  getRootCategories =
    async (c: Context) => {
      const categories =
        await this.categoriesService.getRootCategories();

      return c.json(
        successResponse(
          "Root categories retrieved",
          {
            data: categories,
          }
        )
      );
    };

  getCategoryChildren =
    async (c: Context) => {
      const id =
        getCategoryId(c);

      if (!id) {
        return c.json(
          errorResponse(
            "Category id is required"
          ),
          400
        );
      }

      const children =
        await this.categoriesService.getCategoryChildren(
          id
        );

      return c.json(
        successResponse(
          "Category children retrieved",
          {
            data: children,
          }
        )
      );
    };

  createCategory = async (
    c: Context
  ) => {
    const payload =
      c.get(
        "validatedBody"
      ) as CreateCategoryDto;

    const result =
      await this.categoriesService.createCategory(
        payload
      );

    if (
      result.status ===
      "name_exists"
    ) {
      return c.json(
        errorResponse(
          "Category name already exists"
        ),
        409
      );
    }

    if (
      result.status ===
      "slug_exists"
    ) {
      return c.json(
        errorResponse(
          "Category slug already exists"
        ),
        409
      );
    }

    if (
      result.status ===
      "parent_not_found"
    ) {
      return c.json(
        errorResponse(
          "Parent category not found"
        ),
        404
      );
    }

    return c.json(
      successResponse(
        "Category created",
        {
          data:
            result.category,
        }
      ),
      201
    );
  };

  updateCategory = async (
    c: Context
  ) => {
    const id =
      getCategoryId(c);

    if (!id) {
      return c.json(
        errorResponse(
          "Category id is required"
        ),
        400
      );
    }

    const payload =
      c.get(
        "validatedBody"
      ) as UpdateCategoryDto;

    const result =
      await this.categoriesService.updateCategory(
        id,
        payload
      );

    if (
      result.status ===
      "not_found"
    ) {
      return c.json(
        errorResponse(
          "Category not found"
        ),
        404
      );
    }

    if (
      result.status ===
      "name_exists"
    ) {
      return c.json(
        errorResponse(
          "Category name already exists"
        ),
        409
      );
    }

    if (
      result.status ===
      "slug_exists"
    ) {
      return c.json(
        errorResponse(
          "Category slug already exists"
        ),
        409
      );
    }

    if (
      result.status ===
      "invalid_parent"
    ) {
      return c.json(
        errorResponse(
          "Category cannot be parent of itself"
        ),
        400
      );
    }

    if (
      result.status ===
      "parent_not_found"
    ) {
      return c.json(
        errorResponse(
          "Parent category not found"
        ),
        404
      );
    }

    return c.json(
      successResponse(
        "Category updated",
        {
          data:
            result.category,
        }
      )
    );
  };

  deleteCategory = async (
    c: Context
  ) => {
    const id =
      getCategoryId(c);

    if (!id) {
      return c.json(
        errorResponse(
          "Category id is required"
        ),
        400
      );
    }

    const result =
      await this.categoriesService.deleteCategory(
        id
      );

    if (
      result.status ===
      "not_found"
    ) {
      return c.json(
        errorResponse(
          "Category not found"
        ),
        404
      );
    }

    if (
      result.status ===
      "has_children"
    ) {
      return c.json(
        errorResponse(
          "Category still has children"
        ),
        400
      );
    }

    return c.json(
      successResponse(
        "Category deleted"
      )
    );
  };

  restoreCategory =
    async (c: Context) => {
      const id =
        getCategoryId(c);

      if (!id) {
        return c.json(
          errorResponse(
            "Category id is required"
          ),
          400
        );
      }

      const result =
        await this.categoriesService.restoreCategory(
          id
        );

      if (
        result.status ===
        "not_found"
      ) {
        return c.json(
          errorResponse(
            "Category not found"
          ),
          404
        );
      }

      return c.json(
        successResponse(
          "Category restored",
          {
            data:
              result.category,
          }
        )
      );
    };

  hardDeleteCategory = async (
    c: Context
  ) => {
    const id =
      getCategoryId(c);

    if (!id) {
      return c.json(
        errorResponse(
          "Category id is required"
        ),
        400
      );
    }

    const result =
      await this.categoriesService.hardDeleteCategory(
        id
      );

    if (
      result.status ===
      "not_found"
    ) {
      return c.json(
        errorResponse(
          "Category not found"
        ),
        404
      );
    }

    if (
      result.status ===
      "has_children"
    ) {
      return c.json(
        errorResponse(
          "Category still has children"
        ),
        400
      );
    }

    return c.json(
      successResponse(
        "Category deleted"
      )
    );
  };
}