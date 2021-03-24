import { mapPricings } from "#/models/pricings.model";
import productService from "#/services/product.service";
import pricingService from "#/services/pricing.service";
import { PricingsRequest } from "#/models/product.model";

export const getProduct = async (id: string) => {
  return productService.get(id);
};

export const getPricings = async ({
  productId,
  pricingsRequest,
}: {
  productId: string;
  pricingsRequest: PricingsRequest;
}) => {
  const [product, pricing] = await Promise.all([
    getProduct(productId),
    pricingService.getPricings({ productCode: productId, ...pricingsRequest }),
  ]);

  return mapPricings(product, pricing);
};
