import { client } from "#/config/client";
import { APPLICATION, getApplication } from "#/config/constants";
import {
  Product,
  ProductCoopRequest,
} from "#/models/services/product.model";

export const subDomain = "api/v1";

export const paths = {
  get: `${subDomain}/cas/products/`,
  getByCoop: `${subDomain}/coop/products/`,
};

export const getEndpoint = (id: string) => `${paths.get}${id}`;

export const getByCoopEndpoint = (id: string) => `${paths.getByCoop}${id}`;

class ProductService {
  private request;

  constructor() {
    this.request = client(getApplication(APPLICATION.PRODUCT));
  }

  public async get(id: string): Promise<Product> {
    return this.request.get(getEndpoint(id)).json<Product>();
  }

  public async getByCoop({
    id,
    coop,
  }: ProductCoopRequest): Promise<Product> {
    return this.request
      .get(getByCoopEndpoint(id), { headers: { coop } })
      .json<Product>();
  }
}

export default new ProductService();
