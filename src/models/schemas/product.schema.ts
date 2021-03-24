import Joi from "joi";

import { PricingsRequest } from "#/models/services/product.model";

export const pricingsRequestSchema = Joi.object<PricingsRequest>({
  page: Joi.number().required(),
  size: Joi.number().required(),
  coop: Joi.string().optional(),
  sort: Joi.string().optional()
});
