import { query } from "../../shared/database/postgres.js";
import type { CreateStoreDto, UpdateStoreDto } from "./stores.dto.js";
import type { Store } from "./stores.model.js";

type StoreRow = {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  address: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

function mapStore(row: StoreRow): Store {
  return {
    id: row.id,
    sellerId: row.seller_id,
    name: row.name,
    description: row.description,
    address: row.address,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const storeColumns = `
  id, seller_id, name, description, address, is_active, created_at, updated_at
`;

export class StoresRepository {
  async findAll(): Promise<Store[]> {
    const result = await query<StoreRow>(
      `SELECT ${storeColumns}
       FROM stores
       ORDER BY created_at DESC`
    );

    return result.rows.map(mapStore);
  }

  async findById(id: string): Promise<Store | null> {
    const result = await query<StoreRow>(
      `SELECT ${storeColumns}
       FROM stores
       WHERE id = $1
       LIMIT 1`,
      [id]
    );

    return result.rows[0] ? mapStore(result.rows[0]) : null;
  }

  async findBySellerId(sellerId: string): Promise<Store[]> {
    const result = await query<StoreRow>(
      `SELECT ${storeColumns}
       FROM stores
       WHERE seller_id = $1
       ORDER BY created_at DESC`,
      [sellerId]
    );

    return result.rows.map(mapStore);
  }

  async create(sellerId: string, payload: CreateStoreDto): Promise<Store> {
    const result = await query<StoreRow>(
      `INSERT INTO stores (seller_id, name, description, address)
       VALUES ($1, $2, $3, $4)
       RETURNING ${storeColumns}`,
      [sellerId, payload.name, payload.description ?? null, payload.address ?? null]
    );

    return mapStore(result.rows[0]);
  }

  async update(id: string, payload: UpdateStoreDto): Promise<Store | null> {
    const result = await query<StoreRow>(
      `UPDATE stores
       SET
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         address = COALESCE($4, address),
         is_active = COALESCE($5, is_active),
         updated_at = NOW()
       WHERE id = $1
       RETURNING ${storeColumns}`,
      [
        id,
        payload.name ?? null,
        payload.description ?? null,
        payload.address ?? null,
        payload.is_active ?? null
      ]
    );

    return result.rows[0] ? mapStore(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM stores
       WHERE id = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
}
