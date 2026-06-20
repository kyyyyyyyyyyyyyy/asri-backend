import type { Context } from "hono";
import { errorResponse, successResponse } from "../../shared/utils/response.js";
import type { CreateStoreDto, UpdateStoreDto } from "./stores.dto.js";
import { StoresService } from "./stores.service.js";

function getStoreId(c: Context) {
  return c.req.param("id");
}

// for debugging
const userId = "00000000-0000-4000-8000-000000000002";

export class StoresHandler {
  constructor(private readonly storesService = new StoresService()) {}

  getStores = async (c: Context) => {
    const stores = await this.storesService.getStores();

    return c.json(successResponse("Stores retrieved", { data: stores }));
  };

  getMyStores = async (c: Context) => {
    const user = c.get("user");
    const stores = await this.storesService.getStoresBySeller(user.userId);

    return c.json(successResponse("Seller stores retrieved", { data: stores }));
  };

  getStoreById = async (c: Context) => {
    const id = getStoreId(c);

    if (!id) {
      return c.json(errorResponse("Store id is required"), 400);
    }

    const store = await this.storesService.getStoreById(id);

    if (!store) {
      return c.json(errorResponse("Store not found"), 404);
    }

    return c.json(successResponse("Store retrieved", { data: store }));
  };

  createStore = async (c: Context) => {
    // const user = c.get("user");
    const payload = c.get("validatedBody") as CreateStoreDto;
    const store = await this.storesService.createStore(userId, payload);

    return c.json(successResponse("Store created", { data: store }), 201);
  };

  updateStore = async (c: Context) => {
    const id = getStoreId(c);

    if (!id) {
      return c.json(errorResponse("Store id is required"), 400);
    }

    // const user = c.get("user");
    const payload = c.get("validatedBody") as UpdateStoreDto;
    const result = await this.storesService.updateStore(id, userId, payload);

    if (result.status === "not_found") {
      return c.json(errorResponse("Store not found"), 404);
    }

    if (result.status === "forbidden") {
      return c.json(errorResponse("You are not allowed to update this store"), 403);
    }

    return c.json(successResponse("Store updated", { data: result.store }));
  };

  deleteStore = async (c: Context) => {
    const id = getStoreId(c);

    if (!id) {
      return c.json(errorResponse("Store id is required"), 400);
    }

    // const user = c.get("user");
    const result = await this.storesService.deleteStore(id, userId);

    if (result.status === "not_found") {
      return c.json(errorResponse("Store not found"), 404);
    }

    if (result.status === "forbidden") {
      return c.json(errorResponse("You are not allowed to delete this store"), 403);
    }

    return c.json(successResponse("Store deleted"));
  };
}
