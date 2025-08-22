import type { Context, Next } from "koa";
import { getUserFromAuthHeader } from "../utils/supabase";

export async function requireAuth(ctx: Context, next: Next) {
  const authHeader = ctx.request.headers["authorization"] ?? "";
  const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const user = await getUserFromAuthHeader(token);
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: "Invalid authentication" };
    return;
  }
  ctx.state.user = user;
  await next();
}


