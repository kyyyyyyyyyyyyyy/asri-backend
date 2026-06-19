import "dotenv/config";
import { pool, query, withTransaction } from "../postgres.js";

const seedIds = {
  admin: "00000000-0000-4000-8000-000000000001",
  seller: "00000000-0000-4000-8000-000000000002",
  buyer: "00000000-0000-4000-8000-000000000003",
  validator: "00000000-0000-4000-8000-000000000004",
  driver: "00000000-0000-4000-8000-000000000005",
  store: "00000000-0000-4000-8000-000000000101",
  categoryFresh: "00000000-0000-4000-8000-000000000201",
  categoryCraft: "00000000-0000-4000-8000-000000000202",
  productCoffee: "00000000-0000-4000-8000-000000000301",
  productHoney: "00000000-0000-4000-8000-000000000302",
  order: "00000000-0000-4000-8000-000000000401",
  orderItemCoffee: "00000000-0000-4000-8000-000000000402",
  transaction: "00000000-0000-4000-8000-000000000501",
  shipment: "00000000-0000-4000-8000-000000000601",
  complaint: "00000000-0000-4000-8000-000000000701",
  productValidation: "00000000-0000-4000-8000-000000000801"
};

async function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required before running the database seeder.");
  }
}

async function assertMigrationsApplied() {
  await query("SELECT 1 FROM users LIMIT 1");
}

async function seedUsers() {
  await query(
    `INSERT INTO users (id, email, name, avatar_url, google_id, role)
     VALUES
       ($1, $2, $3, $4, $5, 'admin'),
       ($6, $7, $8, $9, $10, 'seller'),
       ($11, $12, $13, $14, $15, 'buyer'),
       ($16, $17, $18, $19, $20, 'validator'),
       ($21, $22, $23, $24, $25, 'driver')
     ON CONFLICT (id) DO UPDATE
     SET email = EXCLUDED.email,
         name = EXCLUDED.name,
         avatar_url = EXCLUDED.avatar_url,
         google_id = EXCLUDED.google_id,
         role = EXCLUDED.role,
         updated_at = NOW(),
         deleted_at = NULL`,
    [
      seedIds.admin,
      "admin@asri.test",
      "ASRI Admin",
      null,
      "seed-google-admin",
      seedIds.seller,
      "seller@asri.test",
      "Sari Seller",
      null,
      "seed-google-seller",
      seedIds.buyer,
      "buyer@asri.test",
      "Bima Buyer",
      null,
      "seed-google-buyer",
      seedIds.validator,
      "validator@asri.test",
      "Vina Validator",
      null,
      "seed-google-validator",
      seedIds.driver,
      "driver@asri.test",
      "Dimas Driver",
      null,
      "seed-google-driver"
    ]
  );
}

async function seedProfiles() {
  await query(
    `INSERT INTO seller_profiles (user_id, status, business_name, business_address)
     VALUES ($1, 'approved', $2, $3)
     ON CONFLICT (user_id) DO UPDATE
     SET status = EXCLUDED.status,
         business_name = EXCLUDED.business_name,
         business_address = EXCLUDED.business_address,
         updated_at = NOW()`,
    [seedIds.seller, "Kebun Asri Nusantara", "Jl. Pasar Tani No. 10"]
  );

  await query(
    `INSERT INTO buyer_profiles (user_id, phone, address)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE
     SET phone = EXCLUDED.phone,
         address = EXCLUDED.address,
         updated_at = NOW()`,
    [seedIds.buyer, "081234567890", "Jl. Pembeli No. 5"]
  );

  await query(
    `INSERT INTO driver_profiles (user_id, phone, vehicle_number, is_available)
     VALUES ($1, $2, $3, TRUE)
     ON CONFLICT (user_id) DO UPDATE
     SET phone = EXCLUDED.phone,
         vehicle_number = EXCLUDED.vehicle_number,
         is_available = EXCLUDED.is_available,
         updated_at = NOW()`,
    [seedIds.driver, "081298765432", "B 1234 ASR"]
  );
}

async function seedCatalog() {
  await query(
    `INSERT INTO stores (id, seller_id, name, description, address, is_active)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     ON CONFLICT (id) DO UPDATE
     SET seller_id = EXCLUDED.seller_id,
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         address = EXCLUDED.address,
         is_active = EXCLUDED.is_active,
         updated_at = NOW()`,
    [
      seedIds.store,
      seedIds.seller,
      "Toko Kebun Asri",
      "Produk lokal langsung dari petani dan pengrajin.",
      "Jl. Pasar Tani No. 10"
    ]
  );

  await query(
    `INSERT INTO categories (id, name, slug, description)
     VALUES
       ($1, $2, $3, $4),
       ($5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE
     SET name = EXCLUDED.name,
         slug = EXCLUDED.slug,
         description = EXCLUDED.description,
         updated_at = NOW(),
         deleted_at = NULL`,
    [
      seedIds.categoryFresh,
      "Produk Segar",
      "produk-segar",
      "Produk pangan segar dari seller lokal.",
      seedIds.categoryCraft,
      "Kerajinan Lokal",
      "kerajinan-lokal",
      "Produk kerajinan dari pengrajin lokal."
    ]
  );

  await query(
    `INSERT INTO products (id, store_id, category_id, name, description, price, stock, status)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, 'approved'),
       ($8, $9, $10, $11, $12, $13, $14, 'pending_validation')
     ON CONFLICT (id) DO UPDATE
     SET store_id = EXCLUDED.store_id,
         category_id = EXCLUDED.category_id,
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         price = EXCLUDED.price,
         stock = EXCLUDED.stock,
         status = EXCLUDED.status,
         updated_at = NOW(),
         deleted_at = NULL`,
    [
      seedIds.productCoffee,
      seedIds.store,
      seedIds.categoryFresh,
      "Kopi Arabika Lokal 250g",
      "Kopi arabika pilihan dari kebun lokal.",
      65000,
      50,
      seedIds.productHoney,
      seedIds.store,
      seedIds.categoryFresh,
      "Madu Hutan 500ml",
      "Madu hutan murni siap divalidasi.",
      85000,
      30
    ]
  );
}

async function seedOperations() {
  await query(
    `INSERT INTO product_validations (id, product_id, validator_id, status, notes)
     VALUES ($1, $2, $3, 'submitted', $4)
     ON CONFLICT (id) DO UPDATE
     SET product_id = EXCLUDED.product_id,
         validator_id = EXCLUDED.validator_id,
         status = EXCLUDED.status,
         notes = EXCLUDED.notes,
         updated_at = NOW()`,
    [seedIds.productValidation, seedIds.productHoney, seedIds.validator, "Menunggu pengecekan label produk."]
  );

  await query(
    `INSERT INTO orders (id, buyer_id, status, total_amount)
     VALUES ($1, $2, 'processing', $3)
     ON CONFLICT (id) DO UPDATE
     SET buyer_id = EXCLUDED.buyer_id,
         status = EXCLUDED.status,
         total_amount = EXCLUDED.total_amount,
         updated_at = NOW()`,
    [seedIds.order, seedIds.buyer, 130000]
  );

  await query(
    `INSERT INTO order_items (id, order_id, product_id, quantity, price)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE
     SET order_id = EXCLUDED.order_id,
         product_id = EXCLUDED.product_id,
         quantity = EXCLUDED.quantity,
         price = EXCLUDED.price`,
    [seedIds.orderItemCoffee, seedIds.order, seedIds.productCoffee, 2, 65000]
  );

  await query(
    `INSERT INTO transactions (id, order_id, status, amount, payment_reference, paid_at)
     VALUES ($1, $2, 'paid', $3, $4, NOW())
     ON CONFLICT (id) DO UPDATE
     SET order_id = EXCLUDED.order_id,
         status = EXCLUDED.status,
         amount = EXCLUDED.amount,
         payment_reference = EXCLUDED.payment_reference,
         paid_at = EXCLUDED.paid_at,
         updated_at = NOW()`,
    [seedIds.transaction, seedIds.order, 130000, "SEED-PAYMENT-001"]
  );

  await query(
    `INSERT INTO shipments (id, order_id, driver_id, type, status, tracking_number, origin_address, destination_address)
     VALUES ($1, $2, $3, 'express', 'picked_up', $4, $5, $6)
     ON CONFLICT (id) DO UPDATE
     SET order_id = EXCLUDED.order_id,
         driver_id = EXCLUDED.driver_id,
         type = EXCLUDED.type,
         status = EXCLUDED.status,
         tracking_number = EXCLUDED.tracking_number,
         origin_address = EXCLUDED.origin_address,
         destination_address = EXCLUDED.destination_address,
         updated_at = NOW()`,
    [
      seedIds.shipment,
      seedIds.order,
      seedIds.driver,
      "ASRI-SEED-0001",
      "Jl. Pasar Tani No. 10",
      "Jl. Pembeli No. 5"
    ]
  );

  await query(
    `INSERT INTO complaints (id, order_id, user_id, title, description, status)
     VALUES ($1, $2, $3, $4, $5, 'open')
     ON CONFLICT (id) DO UPDATE
     SET order_id = EXCLUDED.order_id,
         user_id = EXCLUDED.user_id,
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         status = EXCLUDED.status,
         updated_at = NOW()`,
    [
      seedIds.complaint,
      seedIds.order,
      seedIds.buyer,
      "Contoh komplain pengiriman",
      "Data seed untuk mengembangkan fitur complaint list dan resolve complaint."
    ]
  );
}

async function runSeed() {
  await assertDatabaseConfigured();
  await assertMigrationsApplied();

  await withTransaction(async () => {
    await seedUsers();
    await seedProfiles();
    // await seedCatalog();
    // await seedOperations();
  });
}

runSeed()
  .then(() => {
    console.log("Database seeding completed.");
  })
  .catch((error) => {
    console.error("Database seeding failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
