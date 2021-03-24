import { Pricing } from "./pricing.model";
import { Product as ProductService } from "./services/product.model";

export type Product = {
  id: string;
  name: string;
  code: string;
  coop?: string;
  coreId: number;
  basedOn: string;
  hierarchy: string;
};

export type PricingsRequest = {
  page: number;
  size: number;
  coop?: string;
  sort?: string[];
};

export type PricingsResponse = {
  pricings: Pricing[];
} & Product;

export const mapProduct = (product: ProductService) => ({
  id: product.id,
  coop: product.coop,
  name: product.name,
  code: product.code,
  coreId: product.coreId,
  basedOn: product.basedOn,
  hierarchy: product.hierarchy,
})
