import { query } from "../../shared/database/postgres.js";
import type { CreateOrderDto, OrderQuery } from "./orders.dto.js";
import type { Order, OrderItem } from "./orders.model.js";

type OrderRow = {
  id: string;
  buyer_id: string;
  status: string;
  total_amount: string;
  shipping_amount: string;
  created_at: Date;
  updated_at: Date;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: string;
  created_at: Date;
};

function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    quantity: row.quantity,
    price: Number(row.price),
    createdAt: row.created_at,
  };
}

function mapOrder(row: OrderRow, items: OrderItem[] = []): Order {
  return {
    id: row.id,
    buyerId: row.buyer_id,
    status: row.status as Order["status"],
    totalAmount: Number(row.total_amount),
    shippingAmount: Number(row.shipping_amount),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  };
}

const orderColumns = `
  id,
  buyer_id,
  status,
  total_amount,
  shipping_amount,
  created_at,
  updated_at
`;

const orderItemColumns = `
  id,
  order_id,
  product_id,
  quantity,
  price,
  created_at
`;

export class OrdersRepository {
  async findItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const result = await query<OrderItemRow>(
      `SELECT ${orderItemColumns} FROM order_items WHERE order_id=$1 ORDER BY created_at ASC`,
      [orderId]
    );
    return result.rows.map(mapOrderItem);
  }

  async findAll(params?: OrderQuery): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;

    const values: unknown[] = [];
    const conditions: string[] = [];

    if (params?.buyer_id) {
      values.push(params.buyer_id);
      conditions.push(`buyer_id=$${values.length}`);
    }

    if (params?.status) {
      values.push(params.status);
      conditions.push(`status=$${values.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    values.push(limit);
    values.push(offset);

    const result = await query<OrderRow>(
      `SELECT ${orderColumns} FROM orders ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    const count = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM orders ${where}`,
      values.slice(0, -2)
    );

    const data = await Promise.all(
      result.rows.map(async (row) =>
        mapOrder(row, await this.findItemsByOrderId(row.id))
      )
    );

    return {
      data,
      total: Number(count.rows[0].count),
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Order | null> {
    const result = await query<OrderRow>(
      `SELECT ${orderColumns} FROM orders WHERE id=$1 LIMIT 1`,
      [id]
    );

    if (!result.rows[0]) return null;

    return mapOrder(
      result.rows[0],
      await this.findItemsByOrderId(id)
    );
  }

  async create(payload: CreateOrderDto): Promise<Order> {
    const result = await query<OrderRow>(
      `INSERT INTO orders (buyer_id, total_amount) VALUES ($1, $2) RETURNING ${orderColumns}`,
      [payload.buyer_id, 0]
    );

    return mapOrder(result.rows[0]);
  }

  async createItem(
    orderId: string,
    productId: string,
    quantity: number,
    price: number
  ): Promise<OrderItem> {
    const result = await query<OrderItemRow>(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING ${orderItemColumns}`,
      [orderId, productId, quantity, price]
    );

    return mapOrderItem(result.rows[0]);
  }

  async updateTotal(orderId: string, totalAmount: number): Promise<void> {
    await query(
      `UPDATE orders SET total_amount=$2, updated_at=NOW() WHERE id=$1`,
      [orderId, totalAmount]
    );
  }

  async updateStatus(id: string, status: string): Promise<Order | null> {
    const result = await query<OrderRow>(
      `UPDATE orders SET status=$2, updated_at=NOW() WHERE id=$1 RETURNING ${orderColumns}`,
      [id, status]
    );

    return result.rows[0] ? mapOrder(result.rows[0]) : null;
  }
}
