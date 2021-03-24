import { Router, Request, Response, NextFunction } from "express";

import { ERROR_MESSAGES } from "#/config/constants";
import { PricingsRequest } from "#/models/services/product.model";
import { pricingsRequestSchema } from "#/models/schemas/product.schema";
import { requestQuery as schemaQuery } from "#/middlewares/schema.middleware";
import { get, getPricings, getByCoop } from "#/controllers/product.controller";


export const path = "/products";

export const getEndpoint = () => "/:id";

export const getByCoopEndpoint = () => "/:id/coop/:coop";

export const getPricingsEndpoint = () => "/:productCode/pricings";

export const router = Router();

router
  .route(getEndpoint())
  .get(async (request: Request, response: Response, next: NextFunction) => {
    try {
      const product = await get(request.params.id);

      return response.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  });

router
  .route(getByCoopEndpoint())
  .get(async (request: Request, response: Response, next: NextFunction) => {
    try {
      const productByCoop = await getByCoop({
        id: request.params.id,
        coop: request.params.coop,
      });

      return response.status(200).json(productByCoop);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  getPricingsEndpoint(),
  schemaQuery({
    schema: pricingsRequestSchema,
    friendlyMsg: ERROR_MESSAGES.INVALID_SEARCH,
  }),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await getPricings({
        productId: request.params.productId,
        pricingsRequest: (request.query as unknown) as PricingsRequest,
      });

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);
