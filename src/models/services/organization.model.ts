export type Entity = {
  idEntidade: string;
  codigoEntidade: string;
  tipoEntidade: string;
  entidadePaiId: string;
  entidadesFilhas: Child[];
};
export type Child = {
  idEntidade: string;
  nomeFantasia: string;
};
