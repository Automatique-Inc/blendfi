import type { Context, Next } from "koa";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    const status = (err as any)?.status || 500;
    const message = (err as any)?.message || "Internal Server Error";
    ctx.status = status;
    ctx.body = { error: message };
    ctx.app.emit("error", err, ctx);
  }
}


