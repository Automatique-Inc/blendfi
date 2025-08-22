import Router from "@koa/router";
import { requireAuth } from "../middleware/auth";
import { createLinkToken, exchangePublicToken } from "../controllers/plaid.controller";
import { getBankConnections, removeBankConnection } from "../controllers/bankConnection.controller";

export const router = new Router();

router.get("/health", (ctx) => {
  ctx.body = { ok: true };
});

router.post("/plaid/create-link-token", requireAuth, createLinkToken);
router.post("/plaid/exchange-public-token", requireAuth, exchangePublicToken);
router.get("/bank-connections", requireAuth, getBankConnections);
router.delete("/bank-connections/:accountId", requireAuth, removeBankConnection);


