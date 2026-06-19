import { StoresRepository } from "./stores.repository.js";

export class StoresService {
  constructor(private readonly storesRepository = new StoresRepository()) {}
}
