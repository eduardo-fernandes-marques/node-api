import { Router, Response } from "express";

import { notFound } from "#/middlewares";

import * as userRouter from "./user.router";
import * as productRouter from "./product.router";
import * as pricingRouter from "./pricing.router";
import * as pricingsRouter from "./pricings.router";
import * as guaranteeRouter from "./guarantee.router";
import * as organizationRouter from "./organization.router";

const router = Router();

router.use(userRouter.path, userRouter.router);
router.use(productRouter.path, productRouter.router);
router.use(pricingRouter.path, pricingRouter.router);
router.use(pricingsRouter.path, pricingsRouter.router);
router.use(guaranteeRouter.path, guaranteeRouter.router);
router.use(organizationRouter.path, organizationRouter.router);

router.use("/health", async (_, response: Response) =>
  response.status(200).end()
);

router.all("*", notFound);

export { router };
