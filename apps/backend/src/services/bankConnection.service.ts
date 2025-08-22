import { supabaseAdmin } from "../utils/supabase";

export type BankConnectionRecord = {
  user_id: string;
  account_id: string;
  institution_name: string;
  access_token_encrypted: string;
  item_id?: string | null;
};

export async function upsertBankConnection(record: BankConnectionRecord): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bank_connections")
    .upsert(record, { onConflict: "user_id,account_id" });
  if (error) throw new Error(`Failed to persist bank connection: ${error.message}`);
}

export async function listBankConnections(userId: string): Promise<Array<Pick<BankConnectionRecord, "account_id" | "institution_name">>> {
  const { data, error } = await supabaseAdmin
    .from("bank_connections")
    .select("account_id,institution_name")
    .eq("user_id", userId);
  if (error) throw new Error(`Failed to list bank connections: ${error.message}`);
  return (data ?? []) as Array<Pick<BankConnectionRecord, "account_id" | "institution_name">>;
}

export async function deleteBankConnection(userId: string, accountId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bank_connections")
    .delete()
    .eq("user_id", userId)
    .eq("account_id", accountId);
  if (error) throw new Error(`Failed to delete bank connection: ${error.message}`);
}


