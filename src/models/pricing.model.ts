import {
  Pricing as PricingService,
  InsertUpdate as InsertUpdateService,
  PricingPaginationResponse as PricingPaginationResponseService,
} from "#/models/services/pricing.model";

export type Pricing = PricingService;

export type InsertUpdate = InsertUpdateService;

export type PricingPaginationResponse = Pick<
  PricingPaginationResponseService,
  "size" | "number" | "content" | "totalPages"
>;

export const mapPricing = (
  pricingPaginationResponseService: PricingPaginationResponseService
) => ({
  size: pricingPaginationResponseService.size,
  number: pricingPaginationResponseService.number,
  content: pricingPaginationResponseService.content,
  totalPages: pricingPaginationResponseService.totalPages,
});
