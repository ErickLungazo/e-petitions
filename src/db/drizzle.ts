import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless"; // this line is missing!!

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!); // you create a client
export const db = drizzle(sql); // pass the client here
