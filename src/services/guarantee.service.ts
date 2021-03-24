import { client }  from "#/config/client";
import { Type } from "#/models/services/guarantee.model";
import { APPLICATION, getApplication } from "#/config/constants";

export const subDomain = "api/v1";

export const paths = {
  types: `${subDomain}/guarantees/types`,
};

export const getTypesEndpoint = () => paths.types;

class GuaranteeService {
  private request;

  constructor() {
    this.request = client(getApplication(APPLICATION.GUARANTEE));
  }

  public async getTypes(): Promise<Type[]> {
    return this.request.get(getTypesEndpoint()).json<Type[]>();
  }
}

export default new GuaranteeService();
