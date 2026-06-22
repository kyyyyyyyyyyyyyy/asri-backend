import type { Context } from "hono";

import {
  successResponse,
  errorResponse,
} from "../../shared/utils/response.js";

import type {
  CreateProductDto,
  UpdateProductDto,
  ProductQuery,
} from "./products.dto.js";

import { ProductsService } from "./products.service.js";

function getProductId(
  c: Context
) {
  return c.req.param(
    "id"
  );
}

function getStoreId(
  c: Context
) {
  return c.req.param(
    "storeId"
  );
}

export class ProductsHandler {
  constructor(
    private readonly productsService =
      new ProductsService()
  ) {}

  getProducts =
    async (
      c: Context
    ) => {
      const query: ProductQuery =
        {
          search:
            c.req.query(
              "search"
            ),

          store_id:
            c.req.query(
              "store_id"
            ),

          category_id:
            c.req.query(
              "category_id"
            ),

          status:
            c.req.query(
              "status"
            ) as ProductQuery["status"],
        };

      const products =
        await this.productsService.getProducts(
          query
        );

      return c.json(
        successResponse(
          "Products retrieved",
          {
            data:
              products,
          }
        )
      );
    };

  getProductsByStore =
    async (
      c: Context
    ) => {
      const storeId =
        getStoreId(
          c
        );

      if (
        !storeId
      ) {
        return c.json(
          errorResponse(
            "Store id is required"
          ),
          400
        );
      }

      const products =
        await this.productsService.getProductsByStore(
          storeId
        );

      return c.json(
        successResponse(
          "Store products retrieved",
          {
            data:
              products,
          }
        )
      );
    };

  getProductById =
    async (
      c: Context
    ) => {
      const id =
        getProductId(
          c
        );

      if (
        !id
      ) {
        return c.json(
          errorResponse(
            "Product id is required"
          ),
          400
        );
      }

      const product =
        await this.productsService.getProductById(
          id
        );

      if (
        !product
      ) {
        return c.json(
          errorResponse(
            "Product not found"
          ),
          404
        );
      }

      return c.json(
        successResponse(
          "Product retrieved",
          {
            data:
              product,
          }
        )
      );
    };

    createProduct = async (c: Context) => {
      const payload =
        c.get("validatedBody") as CreateProductDto;
      const files = c.get("files");

      const buffers = await Promise.all(
        files.map(async (file: File) =>
          Buffer.from(await file.arrayBuffer())
        )
      );

      const result =
        await this.productsService.createProduct(
          payload,
          buffers
        );

      return c.json(
        successResponse("Product created", {
          data: result.product,
        }),
        201
      );
    };

    updateProduct =
      async (
        c: Context
      ) => {
        const id =
          getProductId(
            c
          );

        if (!id) {
          return c.json(
            errorResponse(
              "Product id is required"
            ),
            400
          );
        }

        const payload =
          c.get(
            "validatedBody"
          ) as UpdateProductDto;

        const files =
          c.get(
            "files"
          ) as File[];

        const deleteImages =
          c.get(
            "deleteImages"
          ) as string[];

        const buffers =
          await Promise.all(
            files.map(
              async (
                file
              ) =>
                Buffer.from(
                  await file.arrayBuffer()
                )
            )
          );

        const result =
          await this.productsService.updateProduct(
            id,
            payload,
            buffers,
            deleteImages
          );

        if (
          result.status ===
          "not_found"
        ) {
          return c.json(
            errorResponse(
              "Product not found"
            ),
            404
          );
        }

        return c.json(
          successResponse(
            "Product updated",
            {
              data:
                result.product,
            }
          )
        );
      };

  deleteProduct =
    async (
      c: Context
    ) => {
      const id =
        getProductId(
          c
        );

      if (
        !id
      ) {
        return c.json(
          errorResponse(
            "Product id is required"
          ),
          400
        );
      }

      const result =
        await this.productsService.deleteProduct(
          id
        );

      if (
        result.status ===
        "not_found"
      ) {
        return c.json(
          errorResponse(
            "Product not found"
          ),
          404
        );
      }

      return c.json(
        successResponse(
          "Product deleted"
        )
      );
    };

  restoreProduct =
    async (
      c: Context
    ) => {
      const id =
        getProductId(
          c
        );

      if (!id) {
        return c.json(
          errorResponse(
            "Product id is required"
          ),
          400
        );
      }

      const result =
        await this.productsService.restoreProduct(
          id
        );

      if (
        result.status ===
        "not_found"
      ) {
        return c.json(
          errorResponse(
            "Product not found"
          ),
          404
        );
      }

      return c.json(
        successResponse(
          "Product restored",
          {
            data:
              result.product,
          }
        )
      );
    };

  hardDeleteProduct =
    async (
      c: Context
    ) => {
      const id =
        getProductId(
          c
        );

      if (!id) {
        return c.json(
          errorResponse(
            "Product id is required"
          ),
          400
        );
      }

      const result =
        await this.productsService.hardDeleteProduct(
          id
        );

      if (
        result.status ===
        "not_found"
      ) {
        return c.json(
          errorResponse(
            "Product not found"
          ),
          404
        );
      }

      return c.json(
        successResponse(
          "Product deleted"
        )
      );
    };
}