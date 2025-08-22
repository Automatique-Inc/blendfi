import type { Context } from "koa";
import { listBankConnections, deleteBankConnection } from "../services/bankConnection.service";

export async function getBankConnections(ctx: Context) {
  const userId = (ctx.state as any)?.user?.id as string | undefined;
  if (!userId) ctx.throw(401, "Unauthorized");
  const items = await listBankConnections(userId);
  ctx.body = { connections: items };
}

export async function removeBankConnection(ctx: Context) {
  const userId = (ctx.state as any)?.user?.id as string | undefined;
  if (!userId) ctx.throw(401, "Unauthorized");
  const accountId = (ctx.params as any)?.accountId as string | undefined;
  if (!accountId) ctx.throw(400, "accountId is required");
  await deleteBankConnection(userId, accountId);
  ctx.status = 204;
}


