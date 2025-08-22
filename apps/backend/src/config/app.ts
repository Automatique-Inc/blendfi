import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { env } from "./env";
import { router as apiRouter } from "../routes";
import { errorHandler } from "../middleware/errorHandler";

const app = new Koa();

app.use(cors());
app.use(errorHandler);
app.use(bodyParser({ enableTypes: ["json"], jsonLimit: "1mb" }));

const rootRouter = new Router({ prefix: "/api" });
rootRouter.use(apiRouter.routes());
rootRouter.use(apiRouter.allowedMethods());

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

app.on("error", (err: unknown) => {
  // eslint-disable-next-line no-console
  console.error("App error:", err);
});

export { app, env };


