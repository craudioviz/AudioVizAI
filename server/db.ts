import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  const errorMessage = "DATABASE_URL environment variable is required but not set. Please ensure the database is properly provisioned and the DATABASE_URL secret is configured in your deployment environment.";
  console.error("DATABASE ERROR:", errorMessage);
  throw new Error(errorMessage);
}

// Validate DATABASE_URL format
try {
  const url = new URL(process.env.DATABASE_URL);
  if (!url.protocol.startsWith('postgres')) {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection string");
  }
} catch (urlError) {
  const errorMessage = `Invalid DATABASE_URL format: ${urlError instanceof Error ? urlError.message : 'Unknown format error'}`;
  console.error("DATABASE ERROR:", errorMessage);
  throw new Error(errorMessage);
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });