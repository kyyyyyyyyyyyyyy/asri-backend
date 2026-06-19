import { serve } from "@hono/node-server";
import "dotenv/config";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

serve(
  {
    fetch: app.fetch,
    port
  },
  (info) => {
    console.log(`ASRI API listening on http://localhost:${info.port}`);
  }
);
