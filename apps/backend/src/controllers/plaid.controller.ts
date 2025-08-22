import type { Context } from "koa";
import { plaidClient } from "../services/plaid.service";
import { encryptString } from "../utils/crypto";
import { upsertBankConnection } from "../services/bankConnection.service";

export async function createLinkToken(ctx: Context) {
  type Body = { userId?: string };
  const body = (ctx.request.body ?? {}) as Body;
  const authUserId = (ctx.state as any)?.user?.id as string | undefined;
  const userId: string | undefined = authUserId ?? body.userId;
  if (!userId) ctx.throw(400, "userId is required");

  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "BlendFi",
    products: ["auth", "transactions"],
    country_codes: ["US"],
    language: "en",
  } as any);

  ctx.body = {
    linkToken: response.data.link_token,
    expiration: response.data.expiration,
  };
}

export async function exchangePublicToken(ctx: Context) {
  type Body = { publicToken?: string; accountId?: string; institutionName?: string };
  const { publicToken, accountId, institutionName } = (ctx.request.body ?? {}) as Body;
  if (!publicToken || !accountId || !institutionName) {
    ctx.throw(400, "publicToken, accountId, institutionName are required");
  }

  const exchange = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
  const accessToken = exchange.data.access_token;
  const itemId = exchange.data.item_id;

  const userId = (ctx.state as any)?.user?.id as string | undefined;
  if (!userId) ctx.throw(401, "Unauthorized");

  const encrypted = encryptString(accessToken);
  await upsertBankConnection({
    user_id: userId,
    account_id: accountId,
    institution_name: institutionName,
    access_token_encrypted: encrypted,
    item_id: itemId,
  });

  ctx.body = { success: true };
}


