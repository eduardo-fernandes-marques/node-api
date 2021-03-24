import { client }  from "#/config/client";
import { Entity } from "#/models/services/organization.model";
import { APPLICATION, getApplication } from "#/config/constants";

export const subDomain = "api/v1";

export const paths = {
  entity: `${subDomain}/entities`
};

export const getEntityEndpoint = (id: string) => `${paths.entity}/${id}`;

class OrganizationService {
  private request;

  constructor() {
    this.request = client(getApplication(APPLICATION.ORGANIZATION));
  }

  public async getEntity(id: string): Promise<Entity> {
    return this.request.get(getEntityEndpoint(id)).json<Entity>();
  }
}

export default new OrganizationService();
