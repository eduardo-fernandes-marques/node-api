import { client } from "#/config/client";
import { APPLICATION, getApplication } from "#/config/constants";
import {
  Pricing,
  InsertUpdate,
  AverageMinimumCost,
  PricingPaginationRequest,
  PricingPaginationResponse,
} from "#/models/services/pricing.model";

export const subDomain = "api/v1";
export const subDomain2 = "api/v2";

export const paths = {
  delete: `${subDomain}/pricing/config`,
  update: `${subDomain}/pricing/config`,
  get: `${subDomain}/pricing/config/id`,
  amc: `${subDomain}/pricing/config/amc`,
  insert: `${subDomain}/pricing/config/create`,
  productPricing: `${subDomain}/pricing/config`,
  pricings: `${subDomain2}/configuration`,
};

export const updateEndpoint = () => paths.update;

export const insertEndpoint = () => paths.insert;

export const getEndpoint = (id: string) => `${paths.get}/${id}`;

export const deleteEndpoint = (id: string) => `${paths.delete}/${id}`;

export const getAverageMinimumCostEndpoint = ({
  id,
  coop,
}: {
  id: string;
  coop?: string | string[];
}) => `${paths.amc}/${id}${coop ? `?organization=${coop}` : ""}`;

export const getProductPricingEndpoint = ({
  id,
  coop,
}: {
  id: string;
  coop?: string | string[];
}) => `${paths.productPricing}/${id}${coop ? `?organization=${coop}` : ""}`;

export const getPricingsEndpoint = ({
  coop,
  page,
  size,
  sort,
  productCode,
}: PricingPaginationRequest) =>
  `${paths.pricings}?productCode=${productCode}&page=${page}&size=${size}${
    coop ? `&coop=${coop}` : ""
  }${sort ? `&sort=${sort.length > 1 ? sort.join(",") : sort.shift()}` : ""}`;

class PricingService {
  private request;

  constructor() {
    this.request = client(getApplication(APPLICATION.PRICING));
  }

  public async remove(id: string): Promise<void> {
    return this.request.delete(deleteEndpoint(id)).then();
  }

  public async update(update: InsertUpdate): Promise<{ idPricing: string }> {
    return this.request
      .put(updateEndpoint(), { json: update })
      .json<{ idPricing: string }>();
  }

  public async insert(insert: InsertUpdate): Promise<{ idPricing: string }> {
    return this.request
      .post(insertEndpoint(), { json: insert })
      .json<{ idPricing: string }>();
  }

  public async get(id: string): Promise<Pricing> {
    return this.request.get(getEndpoint(id)).json<Pricing>();
  }

  public async getAverageMinimumCost({
    id,
    coop,
  }: {
    id: string;
    coop?: string | string[];
  }): Promise<AverageMinimumCost[]> {
    return this.request
      .get(getAverageMinimumCostEndpoint({ id, coop }))
      .json<AverageMinimumCost[]>();
  }

  public async getPricings(
    pricingPaginationRequest: PricingPaginationRequest
  ): Promise<PricingPaginationResponse> {
    return this.request
      .get(getPricingsEndpoint(pricingPaginationRequest))
      .json<PricingPaginationResponse>();
  }
}

export default new PricingService();
