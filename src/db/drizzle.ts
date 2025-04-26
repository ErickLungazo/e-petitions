import { drizzle } from "drizzle-orm/neon-http";

// config({ path: ".env" }); // or .env.local
const DATABASE_URL =
  "postgresql://neondb_owner:npg_NtK9wWsFm5CQ@ep-cool-cell-a4h9k16t-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const db = drizzle(DATABASE_URL);
