# ASRI Database Seeder

Seeder ini membuat data awal untuk pengembangan fitur inti tanpa bergantung pada flow auth.

Jalankan migration SQL terlebih dahulu, lalu isi `.env`:

```env
DATABASE_URL=postgresql://user:password@ep-example.neon.tech/asri?sslmode=require
```

Kemudian jalankan:

```bash
npm run seed
```

Data user seed:

| Role | Email |
| --- | --- |
| admin | admin@asri.test |
| seller | seller@asri.test |
| buyer | buyer@asri.test |
| validator | validator@asri.test |
| driver | driver@asri.test |

Seeder bersifat idempotent dan aman dijalankan berulang.
