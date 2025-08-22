import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export type SupabaseUser = {
  id: string;
  email?: string | null;
};

export async function getUserFromAuthHeader(authorizationHeader: string): Promise<SupabaseUser | null> {
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : "";
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return { id: data.user.id, email: data.user.email };
}

export { supabaseAdmin };


