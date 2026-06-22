import { ProductsRepository } from "./products.repository.js";
import { deleteFile, uploadFile } from "../../shared/utils/uploader.js";
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductQuery,
} from "./products.dto.js";

export class ProductsService {
  constructor(
    private readonly productsRepository =
      new ProductsRepository()
  ) {}

  getProducts(
    query?: ProductQuery
  ) {
    return this.productsRepository.findAll(
      query
    );
  }

  getProductById(
    id: string
  ) {
    return this.productsRepository.findById(
      id
    );
  }

  getProductsByStore(
    storeId: string
  ) {
    return this.productsRepository.findAll({
      store_id: storeId,
    });
  }

  async createProduct(
    payload: CreateProductDto,
    files?: Buffer[]
  ) {
    const product =
      await this.productsRepository.create(
        payload
      );

    try {
      if (
        files?.length
      ) {
        for (
          const [
            index,
            file,
          ] of files.entries()
        ) {
          const uploaded =
            await uploadFile(
              file,
              {
                folder:
                  "products",
              }
            );

          await this.productsRepository.createImage(
            product.id,
            uploaded.secureUrl,
            index
          );
        }
      }

      const created =
        await this.productsRepository.findById(
          product.id
        );

      return {
        status:
          "success" as const,

        product:
          created,
      };
    } catch (
      error
    ) {
      await this.productsRepository.softDelete(
        product.id
      );

      throw error;
    }
  }

  async updateProduct(
    id: string,
    payload: UpdateProductDto,
    files?: Buffer[],
    deleteImages?: string[]
  ) {
    const product =
      await this.productsRepository.findById(
        id
      );

    if (
      !product
    ) {
      return {
        status:
          "not_found" as const,
        product:
          null,
      };
    }

    await this.productsRepository.update(
      id,
      payload
    );

    if (
      deleteImages?.length
    ) {
      for (
        const imageId
        of deleteImages
      ) {
        const image =
          product.images.find(
            (
              img
            ) =>
              img.id ===
              imageId
          );

        if (
          image
        ) {
          const publicId =
            image.imageUrl
              .split(
                "/upload/"
              )[1]
              ?.replace(
                /^v\d+\//,
                ""
              )
              ?.replace(
                /\.[^/.]+$/,
                ""
              );

          if (
            publicId
          ) {
            await deleteFile(
              publicId
            );
          }

          await this.productsRepository.deleteImage(
            imageId
          );
        }
      }
    }

    if (
      files?.length
    ) {
      const offset =
        product
          .images
          .length;

      for (
        const [
          index,
          file
        ]
        of files.entries()
      ) {
        const uploaded =
          await uploadFile(
            file,
            {
              folder:
                "products",
            }
          );

        await this.productsRepository.createImage(
          id,
          uploaded.secureUrl,
          offset +
            index
        );
      }
    }

    const updated =
      await this.productsRepository.findById(
        id
      );

    return {
      status:
        "success" as const,

      product:
        updated,
    };
  }

  async deleteProduct(
    id: string
  ) {
    const product =
      await this.productsRepository.findById(
        id
      );

    if (!product) {
      return {
        status:
          "not_found" as const,
      };
    }

    await this.productsRepository.softDelete(
      id
    );

    return {
      status:
        "success" as const,
    };
  }

  async restoreProduct(
    id: string
  ) {
    const product =
      await this.productsRepository.findById(
        id
      );

    if (!product) {
      return {
        status:
          "not_found" as const,
      };
    }

    const restored =
      await this.productsRepository.restore(
        id
      );

    return {
      status:
        "success" as const,

      product:
        restored,
    };
  }

  async hardDeleteProduct(
    id: string
  ) {
    const product =
      await this.productsRepository.findById(
        id
      );

    if (!product) {
      return {
        status:
          "not_found" as const,
      };
    }

    try {
      if (
        product.images.length
      ) {
        await Promise.all(
          product.images.map(
            async (
              image
            ) => {
              const publicId =
                image.imageUrl
                  .split(
                    "/upload/"
                  )[1]
                  ?.replace(
                    /^v\d+\//,
                    ""
                  )
                  ?.replace(
                    /\.[^/.]+$/,
                    ""
                  );

              if (
                publicId
              ) {
                await deleteFile(
                  publicId
                );
              }
            }
          )
        );
      }

      await this.productsRepository.hardDelete(
        id
      );

      return {
        status:
          "success" as const,
      };
    } catch (
      error
    ) {
      throw error;
    }
  }
}