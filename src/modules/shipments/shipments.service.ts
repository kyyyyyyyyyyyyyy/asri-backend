import { ShipmentsRepository } from "./shipments.repository.js";

export class ShipmentsService {
  constructor(private readonly shipmentsRepository = new ShipmentsRepository()) {}
}
