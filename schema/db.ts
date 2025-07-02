import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema/schema'; // adjust if your schema is in a different path
import * as dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: '34.34.181.187',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

