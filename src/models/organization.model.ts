import { Entity as EntityService } from "./services/organization.model";

export type Entity = {
  id: string;
  code: string;
  type: string;
  parentId: string;
  childrens: Children[];
};

export type Children = {
  id: string;
  name: string;
};

export const mapEntity = (entityService: EntityService): Entity => ({
  id: entityService.idEntidade,
  code: entityService.codigoEntidade,
  type: entityService.tipoEntidade,
  parentId: entityService.entidadePaiId,
  childrens: entityService.entidadesFilhas.map((child) => ({
    id: child.idEntidade,
    name: child.nomeFantasia,
  })),
});
