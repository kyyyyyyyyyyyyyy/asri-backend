import { ProductValidationsRepository } from "./product-validations.repository.js";

export class ProductValidationsService {
  constructor(private readonly productValidationsRepository = new ProductValidationsRepository()) {}
}
