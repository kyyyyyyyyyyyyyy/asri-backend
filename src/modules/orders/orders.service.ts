import { query, withTransaction } from "../../shared/database/postgres.js";
import { OrdersRepository } from "./orders.repository.js";
import { snap } from "../../shared/config/midtrans.js";
import type { CreateOrderDto, OrderQuery } from "./orders.dto.js";
import type { Order } from "./orders.model.js";
import type { CreateOrderResult } from "./orders.dto.js";

type ProductInfo = {
  product_id: string;
  quantity: number;
  price: number;
  store_id: string;
};

export class OrdersService {
  constructor(private readonly ordersRepository = new OrdersRepository()) {}

  getOrders(queryParams?: OrderQuery): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.ordersRepository.findAll(queryParams);
  }

  getOrderById(id: string): Promise<Order | null> {
    return this.ordersRepository.findById(id);
  }

  async createOrder(payload: CreateOrderDto, buyer_id: string): Promise<CreateOrderResult> {
    const products: ProductInfo[] = [];

    for (const item of payload.items) {
      const productResult = await query<{ price: string; store_id: string }>(
        `SELECT price, store_id FROM products WHERE id=$1 AND deleted_at IS NULL LIMIT 1`,
        [item.product_id]
      );

      if (!productResult.rows[0]) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      products.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(productResult.rows[0].price),
        store_id: productResult.rows[0].store_id,
      });
    }

    const storeItemIndices = new Map<string, number[]>();
    for (let i = 0; i < products.length; i++) {
      const indices = storeItemIndices.get(products[i].store_id) ?? [];
      indices.push(i);
      storeItemIndices.set(products[i].store_id, indices);
    }

    //ongkir masih manual
    const shippingCost = 10000;

    const result = await withTransaction(async (client) => {
      const itemSubtotal = products.reduce((s, p) => s + p.price * p.quantity, 0);
      const totalShipping = storeItemIndices.size * shippingCost;

      const orderResult = await client.query(
        `INSERT INTO orders (buyer_id, total_amount, shipping_amount) VALUES ($1, $2, $3) RETURNING id, buyer_id, status, total_amount, shipping_amount, created_at, updated_at`,
        [buyer_id, itemSubtotal + totalShipping, totalShipping]
      );

      const orderRow = orderResult.rows[0];

      const insertedItemIds: string[] = [];

      for (const p of products) {
        const itemResult = await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING id`,
          [orderRow.id, p.product_id, p.quantity, p.price]
        );
        insertedItemIds.push(itemResult.rows[0].id);
      }

      const buyerProfileResult = await client.query(
        `SELECT address FROM buyer_profiles WHERE user_id=$1 LIMIT 1`,
        [buyer_id]
      );

      for (const [storeId, indices] of storeItemIndices) {
        const originResult = await client.query(
          `SELECT address FROM stores WHERE id=$1 LIMIT 1`,
          [storeId]
        );

        const shipmentResult = await client.query(
          `INSERT INTO shipments (order_id, store_id, type, status, origin_address, destination_address, shipping_cost) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [
            orderRow.id,
            storeId,
            "economy",
            "waiting",
            originResult.rows[0]?.address ?? null,
            buyerProfileResult.rows[0]?.address ?? null,
            shippingCost,
          ]
        );

        const shipmentId = shipmentResult.rows[0].id;

        for (const idx of indices) {
          await client.query(
            `UPDATE order_items SET shipment_id=$1 WHERE id=$2`,
            [shipmentId, insertedItemIds[idx]]
          );
        }
      }

      const transactionCode = `ORDER-${orderRow.id}`;

      const transactionResult = await client.query(
        `INSERT INTO transactions (order_id, status, amount, transaction_code) VALUES ($1, $2, $3, $4) RETURNING id`,
        [orderRow.id, "unpaid", orderRow.total_amount, transactionCode]
      );

      return {
        order: orderRow,
        transactionId: transactionResult.rows[0].id,
        transactionCode,
      };
    });

    try {
      const midtransPayload = {
        transaction_details: {
          order_id: result.transactionCode,
          gross_amount: Number(result.order.total_amount),
        },
        credit_card: {
          secure: true,
        },
      };

      const midtransResponse = await snap.createTransaction(midtransPayload);

      await query(
        `UPDATE transactions SET snap_token=$1, transaction_time=NOW() WHERE id=$2`,
        [midtransResponse.token, result.transactionId]
      );
    } catch {
      await query(
        `UPDATE transactions SET status=$1 WHERE id=$2`,
        ["failed", result.transactionId]
      );
    }

    const order = await this.ordersRepository.findById(result.order.id);

    const snapResult = await query<{ snap_token: string | null }>(
      `SELECT snap_token FROM transactions WHERE id=$1 LIMIT 1`,
      [result.transactionId]
    );

    return {
      order: order!,
      snapToken: snapResult.rows[0]?.snap_token ?? null,
    };
  }

  async cancelOrder(id: string, buyerId: string): Promise<{ status: "success"; order: Order } | { status: "not_found" } | { status: "cannot_cancel" }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      return { status: "not_found" };
    }

    if (order.buyerId !== buyerId) {
      return { status: "cannot_cancel" };
    }

    if (order.status !== "pending") {
      return { status: "cannot_cancel" };
    }

    const updated = await this.ordersRepository.updateStatus(id, "cancelled");

    return { status: "success", order: updated! };
  }
}
