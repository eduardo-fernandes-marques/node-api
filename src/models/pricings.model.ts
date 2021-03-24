import { Pricing } from "./pricing.model";
import { Product } from "./product.model";
import { Product as ProductService } from "./services/product.model";
import { PricingPaginationResponse as PricingPaginationResponseService } from "./services/pricing.model";

export type PricingsRequest = {
  page: number;
  size: number;
  coop?: string;
  sort?: string[];
};

export type PricingsResponse = {
  size: number;
  number: number;
  totalPages: number;
  pricings: Pricing[];
} & Product;

export const mapPricings = (
  productService: ProductService,
  pricingPaginationResponseService: PricingPaginationResponseService
) =>
  ({
    id: productService.id,
    name: productService.name,
    code: productService.code,
    coreId: productService.coreId,
    basedOn: productService.basedOn,
    hierarchy: productService.hierarchy,
    size: pricingPaginationResponseService.size,
    number: pricingPaginationResponseService.number,
    totalPages: pricingPaginationResponseService.totalPages,
    pricings: [...pricingPaginationResponseService.content],
    ...(productService.coop ? { coop: productService.coop } : {}),
  } as PricingsResponse);
