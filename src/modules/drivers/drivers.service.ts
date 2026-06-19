import { DriversRepository } from "./drivers.repository.js";

export class DriversService {
  constructor(private readonly driversRepository = new DriversRepository()) {}
}
