import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneGNwYW1rZm9vZHFkcmF1eHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDExNDIsImV4cCI6MjA1NTAxNzE0Mn0.by6HAdPjwE3x3tdRGoSBvzOduJqG9FDHnFPTWaVD2Dc";
export const SUPABASE_URL = "https://fgxcpamkfoodqdrauxzu.supabase.co";
export const SUPABASE_BUCKET = "e-petitions"; // Your Supabase storage bucket name
