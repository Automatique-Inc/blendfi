import dotenv from "dotenv";

dotenv.config();

type Env = {
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  PLAID_ENV: "sandbox" | "development" | "production";
  ENCRYPTION_KEY: string;
};

function requireString(name: keyof Env, defaultValue?: string): string {
  const value = process.env[name as string] ?? defaultValue;
  if (!value) throw new Error(`Missing env: ${String(name)}`);
  return value;
}

export const env: Env = {
  PORT: Number(process.env.PORT ?? 3000),
  SUPABASE_URL: requireString("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: requireString("SUPABASE_SERVICE_ROLE_KEY"),
  PLAID_CLIENT_ID: requireString("PLAID_CLIENT_ID"),
  PLAID_SECRET: requireString("PLAID_SECRET"),
  PLAID_ENV: requireString("PLAID_ENV", "sandbox") as Env["PLAID_ENV"],
  ENCRYPTION_KEY: requireString("ENCRYPTION_KEY"),
};


