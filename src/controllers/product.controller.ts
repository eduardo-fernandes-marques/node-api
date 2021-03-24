import { mapPricing} from "#/models/pricing.model";
import productService from "#/services/product.service";
import pricingService from "#/services/pricing.service";
import { mapProduct, PricingsRequest } from "#/models/product.model";
import { ProductCoopRequest } from "#/models/services/product.model";

export const get = async (id: string) => {
  return productService.get(id);
};

export const getByCoop = async (productCoopRequest: ProductCoopRequest) => {
  return productService.getByCoop(productCoopRequest);
};

export const getPricings = async ({
  productId,
  pricingsRequest,
}: {
  productId: string;
  pricingsRequest: PricingsRequest;
}) => {
  const [
    product,
    pricing,
  ] = await Promise.all([
    get(productId),
    pricingService.getPricings({ productCode: productId, ...pricingsRequest }),
  ]);

  return {
   ...mapProduct(product),
    pricing: {...mapPricing(pricing), }
  };
};
