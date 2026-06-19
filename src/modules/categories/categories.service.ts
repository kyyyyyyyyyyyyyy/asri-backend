import { CategoriesRepository } from "./categories.repository.js";

export class CategoriesService {
  constructor(private readonly categoriesRepository = new CategoriesRepository()) {}
}
