import { query } from "../../shared/database/postgres.js";

import type {
  CreateProductDto,
  UpdateProductDto,
  ProductQuery,
} from "./products.dto.js";

import type {
  Product,
  ProductImage,
} from "./products.model.js";

type ProductRow = {
  id: string;
  store_id: string;
  category_id: string | null;

  name: string;

  description: string | null;

  price: string;

  stock: number;

  status:
    | "draft"
    | "pending_validation"
    | "approved"
    | "rejected"
    | "inactive";

  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

type ProductImageRow = {
  id: string;

  product_id: string;

  image_url: string;

  sort_order: number;

  created_at: Date;
};

function mapImage(
  row: ProductImageRow
): ProductImage {
  return {
    id: row.id,
    productId:
      row.product_id,
    imageUrl:
      row.image_url,
    sortOrder:
      row.sort_order,
    createdAt:
      row.created_at,
  };
}

function mapProduct(
  row: ProductRow,
  images: ProductImage[] = []
): Product {
  return {
    id: row.id,

    storeId:
      row.store_id,

    categoryId:
      row.category_id,

    name:
      row.name,

    description:
      row.description,

    price:
      Number(
        row.price
      ),

    stock:
      row.stock,

    status:
      row.status,

    images,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,

    deletedAt:
      row.deleted_at,
  };
}

const productColumns = `
id,
store_id,
category_id,
name,
description,
price,
stock,
status,
created_at,
updated_at,
deleted_at
`;

const imageColumns = `
id,
product_id,
image_url,
sort_order,
created_at
`;

export class ProductsRepository {
  async getImages(
    productId: string
  ): Promise<ProductImage[]> {
    const result =
      await query<ProductImageRow>(
        `
        SELECT ${imageColumns}
        FROM product_images
        WHERE product_id=$1
        ORDER BY sort_order ASC
        `,
        [productId]
      );

    return result.rows.map(
      mapImage
    );
  }

  async findAll(
    params?: ProductQuery
  ): Promise<Product[]> {
    const values:
      unknown[] =
      [];

    let where =
      `
      deleted_at IS NULL
      `;

    if (
      params?.search
    ) {
      values.push(
        `%${params.search}%`
      );

      where += `
      AND name ILIKE $${values.length}
      `;
    }

    if (
      params?.store_id
    ) {
      values.push(
        params.store_id
      );

      where += `
      AND store_id=$${values.length}
      `;
    }

    if (
      params?.category_id
    ) {
      values.push(
        params.category_id
      );

      where += `
      AND category_id=$${values.length}
      `;
    }

    if (
      params?.status
    ) {
      values.push(
        params.status
      );

      where += `
      AND status=$${values.length}
      `;
    }

    const result =
      await query<ProductRow>(
        `
        SELECT ${productColumns}
        FROM products
        WHERE ${where}
        ORDER BY created_at DESC
        `,
        values
      );

    return Promise.all(
      result.rows.map(
        async (
          row
        ) =>
          mapProduct(
            row,
            await this.getImages(
              row.id
            )
          )
      )
    );
  }

  async findById(
    id: string
  ): Promise<Product | null> {
    const result =
      await query<ProductRow>(
        `
        SELECT ${productColumns}
        FROM products
        WHERE id=$1
        LIMIT 1
        `,
        [id]
      );

    if (
      !result.rows[0]
    ) {
      return null;
    }

    return mapProduct(
      result.rows[0],
      await this.getImages(
        id
      )
    );
  }

  async create(
    payload: CreateProductDto
  ): Promise<Product> {
    const result =
      await query<ProductRow>(
        `
        INSERT INTO products
        (
          store_id,
          category_id,
          name,
          description,
          price,
          stock
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6
        )

        RETURNING ${productColumns}
        `,
        [
          payload.store_id,

          payload.category_id ??
            null,

          payload.name,

          payload.description ??
            null,

          payload.price,

          payload.stock ??
            0,
        ]
      );

    return mapProduct(
      result.rows[0]
    );
  }

  async update(
    id: string,
    payload: UpdateProductDto
  ): Promise<Product | null> {
    const result =
      await query<ProductRow>(
        `
        UPDATE products
        SET
          category_id=
            COALESCE(
              $2,
              category_id
            ),

          name=
            COALESCE(
              $3,
              name
            ),

          description=
            COALESCE(
              $4,
              description
            ),

          price=
            COALESCE(
              $5,
              price
            ),

          stock=
            COALESCE(
              $6,
              stock
            ),

          status=
            COALESCE(
              $7,
              status
            ),

          updated_at=
            NOW()

        WHERE id=$1

        RETURNING ${productColumns}
        `,
        [
          id,

          payload.category_id,

          payload.name,

          payload.description,

          payload.price,

          payload.stock,

          payload.status,
        ]
      );

    return result.rows[0]
      ? mapProduct(
          result.rows[0]
        )
      : null;
  }

  async createImage(
    productId: string,
    imageUrl: string,
    sortOrder = 0
  ): Promise<ProductImage> {
    const result =
      await query<ProductImageRow>(
        `
        INSERT INTO product_images
        (
          product_id,
          image_url,
          sort_order
        )

        VALUES
        (
          $1,$2,$3
        )

        RETURNING ${imageColumns}
        `,
        [
          productId,
          imageUrl,
          sortOrder,
        ]
      );

    return mapImage(
      result.rows[0]
    );
  }

  async deleteImage(
    imageId: string
  ): Promise<boolean> {
    const result =
      await query(
        `
        DELETE
        FROM product_images
        WHERE id=$1
        `,
        [imageId]
      );

    return (
      result.rowCount ??
      0
    ) > 0;
  }

  async softDelete(
    id: string
  ): Promise<boolean> {
    const result =
      await query(
        `
        UPDATE products
        SET
          deleted_at=NOW()
        WHERE id=$1
        `,
        [id]
      );

    return (
      result.rowCount ??
      0
    ) > 0;
  }

async restore(id: string): Promise<Product | null> {
  const result =
    await query<ProductRow>(
      `
      UPDATE products
      SET
        deleted_at = NULL,
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${productColumns}
      `,
      [id]
    );

  return result.rows[0]
    ? mapProduct(result.rows[0])
    : null;
}

async hardDelete(
  id: string
): Promise<boolean> {
  const result =
    await query(
      `
      DELETE FROM products
      WHERE id = $1
      `,
      [id]
    );

  return (
    result.rowCount ?? 0
  ) > 0;
}

}