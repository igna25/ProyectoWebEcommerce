import { sql } from "@vercel/postgres";
import { Client } from "pg";

export const pooler = sql;

export async function getDirectClient() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  return client;
}