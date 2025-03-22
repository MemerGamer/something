import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;
// Schema from the api
import * as schema from "../db/schema.js";

// Create database pool
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const db = drizzle(pool, { schema });

export { db };

export type DrizzleDatabaseSession = typeof db;
export type DrizzleTransactionSession = Parameters<Parameters<typeof db.transaction>['0']>['0'];
