import type { Config } from 'drizzle-kit';
export default {
  dialect: 'sqlite',
  driver: 'expo', // <--- very important
  out: './src/drizzle',
  schema: './src/db/schema.ts',
} satisfies Config;
