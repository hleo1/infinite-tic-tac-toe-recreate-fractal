import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.ts";

import "dotenv/config";

// Bun requires SSL for Supabase
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// Create a Drizzle client
export const db = drizzle(sql, { schema });
