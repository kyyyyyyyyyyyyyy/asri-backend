import { CategoriesRepository } from "./categories.repository.js";

import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQuery,
} from "./categories.dto.js";

export class CategoriesService {
  constructor(
    private readonly categoriesRepository =
      new CategoriesRepository()
  ) {}

  getCategories(query?: CategoryQuery) {
    return this.categoriesRepository.findAll(query);
  }

  getCategoryById(id: string) {
    return this.categoriesRepository.findById(id);
  }

  getCategoryBySlug(slug: string) {
    return this.categoriesRepository.findBySlug(slug);
  }

  getRootCategories() {
    return this.categoriesRepository.findRoot();
  }

  getCategoryChildren(parentId: string) {
    return this.categoriesRepository.findChildren(
      parentId
    );
  }

  async createCategory(
    payload: CreateCategoryDto
  ) {
    const existsName =
      await this.categoriesRepository.existsByName(
        payload.name
      );

    if (existsName) {
      return {
        status: "name_exists" as const,
        category: null,
      };
    }

    const existsSlug =
      await this.categoriesRepository.existsBySlug(
        payload.slug
      );

    if (existsSlug) {
      return {
        status: "slug_exists" as const,
        category: null,
      };
    }

    if (payload.parent_id) {
      const parent =
        await this.categoriesRepository.findById(
          payload.parent_id
        );

      if (!parent) {
        return {
          status: "parent_not_found" as const,
          category: null,
        };
      }
    }

    const category =
      await this.categoriesRepository.create(
        payload
      );

    return {
      status: "success" as const,
      category,
    };
  }

  async updateCategory(
    id: string,
    payload: UpdateCategoryDto
  ) {
    const category =
      await this.categoriesRepository.findById(
        id
      );

    if (!category) {
      return {
        status: "not_found" as const,
        category: null,
      };
    }

    if (
      payload.name &&
      payload.name !== category.name
    ) {
      const exists =
        await this.categoriesRepository.existsByName(
          payload.name
        );

      if (exists) {
        return {
          status: "name_exists" as const,
          category: null,
        };
      }
    }

    if (
      payload.slug &&
      payload.slug !== category.slug
    ) {
      const exists =
        await this.categoriesRepository.existsBySlug(
          payload.slug
        );

      if (exists) {
        return {
          status: "slug_exists" as const,
          category: null,
        };
      }
    }

    if (payload.parent_id) {
      if (payload.parent_id === id) {
        return {
          status: "invalid_parent" as const,
          category: null,
        };
      }

      const parent =
        await this.categoriesRepository.findById(
          payload.parent_id
        );

      if (!parent) {
        return {
          status: "parent_not_found" as const,
          category: null,
        };
      }
    }

    const updatedCategory =
      await this.categoriesRepository.update(
        id,
        payload
      );

    return {
      status: "success" as const,
      category: updatedCategory,
    };
  }

  async deleteCategory(id: string) {
    const category =
      await this.categoriesRepository.findById(
        id
      );

    if (!category) {
      return {
        status: "not_found" as const,
      };
    }

    const children =
      await this.categoriesRepository.findChildren(
        id
      );

    if (children.length > 0) {
      return {
        status: "has_children" as const,
      };
    }

    await this.categoriesRepository.softDelete(
      id
    );

    return {
      status: "success" as const,
    };
  }

  async restoreCategory(id: string) {
    const restored =
      await this.categoriesRepository.restore(
        id
      );

    if (!restored) {
      return {
        status: "not_found" as const,
        category: null,
      };
    }

    return {
      status: "success" as const,
      category: restored,
    };
  }

  async hardDeleteCategory(id: string) {
    const category =
      await this.categoriesRepository.findById(
        id
      );

    if (!category) {
      return {
        status: "not_found" as const,
      };
    }

    const children =
      await this.categoriesRepository.findChildren(
        id
      );

    if (children.length > 0) {
      return {
        status: "has_children" as const,
      };
    }

    await this.categoriesRepository.delete(
      id
    );

    return {
      status: "success" as const,
    };
  }
}