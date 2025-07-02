import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

dotenv.config();

// Parse connection string
const config = parse(process.env.LOCAL_POSTGRES_URL!);

export default defineConfig({
  schema: './schema/schema.ts',
  out: './drizzle/migrations',

  dialect: 'postgresql',

  dbCredentials: {
    host: config.host!,
    port: Number(config.port),
    user: config.user,
    password: config.password,
    database: config.database!,
    ssl: false
  },

  migrations: {
    table: '__drizzle_migrations__',
    schema: 'public',
    prefix: 'timestamp',
  },

  introspect: {
    casing: 'camel',
  },

  schemaFilter: 'public',
  tablesFilter: '*',

  verbose: true,
  strict: true,
});
