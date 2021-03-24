import organizationService from "#/services/organization.service";

import { Entity } from "#/models/services/organization.model";

export const getEntity = async (id: string): Promise<Entity> => {
  return organizationService.getEntity(id);
};
