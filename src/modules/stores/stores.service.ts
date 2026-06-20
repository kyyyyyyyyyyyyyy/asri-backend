import { StoresRepository } from "./stores.repository.js";
import type { CreateStoreDto, UpdateStoreDto } from "./stores.dto.js";

export class StoresService {
  constructor(private readonly storesRepository = new StoresRepository()) {}

  getStores() {
    return this.storesRepository.findAll();
  }

  getStoreById(id: string) {
    return this.storesRepository.findById(id);
  }

  getStoresBySeller(sellerId: string) {
    return this.storesRepository.findBySellerId(sellerId);
  }

  createStore(sellerId: string, payload: CreateStoreDto) {
    return this.storesRepository.create(sellerId, payload);
  }

  async updateStore(id: string, sellerId: string, payload: UpdateStoreDto) {
    const store = await this.storesRepository.findById(id);

    if (!store) {
      return { status: "not_found" as const, store: null };
    }

    if (store.sellerId !== sellerId) {
      return { status: "forbidden" as const, store: null };
    }

    const updatedStore = await this.storesRepository.update(id, payload);
    return { status: "success" as const, store: updatedStore };
  }

  async deleteStore(id: string, sellerId: string) {
    const store = await this.storesRepository.findById(id);

    if (!store) {
      return { status: "not_found" as const };
    }

    if (store.sellerId !== sellerId) {
      return { status: "forbidden" as const };
    }

    await this.storesRepository.delete(id);
    return { status: "success" as const };
  }
}
