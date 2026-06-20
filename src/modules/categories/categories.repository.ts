import { query } from "../../shared/database/postgres.js";

import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQuery,
} from "./categories.dto.js";

import type { Category } from "./categories.model.js";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    parentId: row.parent_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

const categoryColumns = `
  id,
  name,
  slug,
  description,
  parent_id,
  created_at,
  updated_at,
  deleted_at
`;

export class CategoriesRepository {
  async findAll(
    params?: CategoryQuery
  ): Promise<{
    data: Category[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const offset = (page - 1) * limit;

    const values: unknown[] = [];

    let where = `
      deleted_at IS NULL
    `;

    if (params?.search) {
      values.push(`%${params.search}%`);

      where += `
        AND (
          name ILIKE $${values.length}
          OR slug ILIKE $${values.length}
        )
      `;
    }

    values.push(limit);
    values.push(offset);

    const result = await query<CategoryRow>(
      `
      SELECT ${categoryColumns}
      FROM categories
      WHERE ${where}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
      `,
      values
    );

    const count = await query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM categories
      WHERE ${where}
      `,
      values.slice(0, -2)
    );

    return {
      data: result.rows.map(mapCategory),
      total: Number(count.rows[0].count),
      page,
      limit,
    };
  }

  async findById(
    id: string
  ): Promise<Category | null> {
    const result = await query<CategoryRow>(
      `
      SELECT ${categoryColumns}
      FROM categories
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    return result.rows[0]
      ? mapCategory(result.rows[0])
      : null;
  }

  async findBySlug(
    slug: string
  ): Promise<Category | null> {
    const result = await query<CategoryRow>(
      `
      SELECT ${categoryColumns}
      FROM categories
      WHERE slug = $1
      LIMIT 1
      `,
      [slug]
    );

    return result.rows[0]
      ? mapCategory(result.rows[0])
      : null;
  }

  async findRoot(): Promise<Category[]> {
    const result = await query<CategoryRow>(
      `
      SELECT ${categoryColumns}
      FROM categories
      WHERE parent_id IS NULL
      AND deleted_at IS NULL
      ORDER BY name
      `
    );

    return result.rows.map(mapCategory);
  }

  async findChildren(
    parentId: string
  ): Promise<Category[]> {
    const result = await query<CategoryRow>(
      `
      SELECT ${categoryColumns}
      FROM categories
      WHERE parent_id = $1
      AND deleted_at IS NULL
      ORDER BY created_at DESC
      `,
      [parentId]
    );

    return result.rows.map(mapCategory);
  }

  async create(
    payload: CreateCategoryDto
  ): Promise<Category> {
    const result = await query<CategoryRow>(
      `
      INSERT INTO categories
      (
        name,
        slug,
        description,
        parent_id
      )
      VALUES ($1,$2,$3,$4)
      RETURNING ${categoryColumns}
      `,
      [
        payload.name,
        payload.slug,
        payload.description ?? null,
        payload.parent_id ?? null,
      ]
    );

    return mapCategory(result.rows[0]);
  }

  async update(
    id: string,
    payload: UpdateCategoryDto
  ): Promise<Category | null> {
    const result = await query<CategoryRow>(
      `
      UPDATE categories
      SET
        name = COALESCE($2,name),
        slug = COALESCE($3,slug),
        description = COALESCE($4,description),
        parent_id = COALESCE($5,parent_id),
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${categoryColumns}
      `,
      [
        id,
        payload.name ?? null,
        payload.slug ?? null,
        payload.description ?? null,
        payload.parent_id ?? null,
      ]
    );

    return result.rows[0]
      ? mapCategory(result.rows[0])
      : null;
  }

  async softDelete(
    id: string
  ): Promise<boolean> {
    const result = await query(
      `
      UPDATE categories
      SET
        deleted_at = NOW()
      WHERE id = $1
      `,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }

  async restore(
    id: string
  ): Promise<Category | null> {
    const result = await query<CategoryRow>(
      `
      UPDATE categories
      SET
        deleted_at = NULL
      WHERE id = $1
      RETURNING ${categoryColumns}
      `,
      [id]
    );

    return result.rows[0]
      ? mapCategory(result.rows[0])
      : null;
  }

  async delete(
    id: string
  ): Promise<boolean> {
    const result = await query(
      `
      DELETE FROM categories
      WHERE id = $1
      `,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }

  async existsByName(
    name: string
  ): Promise<boolean> {
    const result = await query<{
      exists: boolean;
    }>(
      `
      SELECT EXISTS(
        SELECT 1
        FROM categories
        WHERE name = $1
      )
      `,
      [name]
    );

    return result.rows[0].exists;
  }

  async existsBySlug(
    slug: string
  ): Promise<boolean> {
    const result = await query<{
      exists: boolean;
    }>(
      `
      SELECT EXISTS(
        SELECT 1
        FROM categories
        WHERE slug = $1
      )
      `,
      [slug]
    );

    return result.rows[0].exists;
  }
}