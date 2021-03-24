import Joi from "joi";

import { PricingsRequest } from "#/models/services/product.model";

export const requestQuery = Joi.object<PricingsRequest>({
  page: Joi.number().required(),
  size: Joi.number().required(),
  coop: Joi.string().optional(),
  sort: Joi.string().optional(),
});

export const requestParam = Joi.object<{ productId: string }>({
  productId: Joi.string().required(),
});
