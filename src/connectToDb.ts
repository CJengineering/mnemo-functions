import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: '34.34.181.187', // ✅ Use Public IP here
  port: 5432,
  ssl: false, // or true if you've enforced SSL on the DB
});

export async function connectToDb(): Promise<string> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 + 1 AS result');
    client.release();
    return `DB test passed! Result: ${result.rows[0].result}`;
  } catch (error) {
    return `DB connection failed: ${(error as Error).message}`;
  }
}
