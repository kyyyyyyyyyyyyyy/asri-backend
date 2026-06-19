import { ValidatorsRepository } from "./validators.repository.js";

export class ValidatorsService {
  constructor(private readonly validatorsRepository = new ValidatorsRepository()) {}
}
