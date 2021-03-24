import pricingService from "#/services/pricing.service";
import { InsertUpdate } from "#/models/services/pricing.model";

export const get = async (id: string) => pricingService.get(id);

export const remove = async (id: string) => pricingService.remove(id);

export const update = async (update: InsertUpdate) =>
  pricingService.update(update);

export const insert = async (insert: InsertUpdate) =>
  pricingService.insert(insert);

export const getAverageMinimumCost = async ({
  id,
  coop,
}: {
  id: string;
  coop?: string | string[];
}) => pricingService.getAverageMinimumCost({ id, coop });
