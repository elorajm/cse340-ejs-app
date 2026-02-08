// src/models/test-db.js
import "dotenv/config";
import { query } from "./db.js";

const run = async () => {
  const result = await query("SELECT NOW() AS current_time;");
  console.log("Database connection successful:", result.rows[0].current_time);
  process.exit(0);
};

run().catch((err) => {
  console.error("Database connection failed:", err.message);
  process.exit(1);
});
