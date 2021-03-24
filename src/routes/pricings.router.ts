import { Router, Request, Response, NextFunction } from "express";

import { ERROR_MESSAGES } from "#/config/constants";
import { PricingsRequest } from "#/models/pricings.model";
import { getPricings } from "#/controllers/pricings.controller";
import { requestQuery, requestParam } from "#/models/schemas/pricings.schema";
import {
  requestQuery as schemaRequestQuery,
  requestParams as schemaRequestParams,
} from "#/middlewares/schema.middleware";

export const path = "/pricings";

export const getPricingsEndpoint = () => "/:productId";

export const router = Router();

router.get(
  getPricingsEndpoint(),
  schemaRequestQuery({
    schema: requestQuery,
    friendlyMsg: ERROR_MESSAGES.INVALID_SEARCH,
  }),
  schemaRequestParams({
    schema: requestParam,
    friendlyMsg: ERROR_MESSAGES.INVALID_SEARCH,
  }),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      return response.status(200).json(
        await getPricings({
          productId: request.params.productId,
          pricingsRequest: (request.query as unknown) as PricingsRequest,
        })
      );
    } catch (error) {
      return next(error);
    }
  }
);
