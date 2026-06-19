import { ProductsRepository } from "./products.repository.js";

export class ProductsService {
  constructor(private readonly productsRepository = new ProductsRepository()) {}
}
