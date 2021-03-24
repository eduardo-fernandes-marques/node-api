import guaranteeService from "#/services/guarantee.service";

export const getTypes = async () => {
  return guaranteeService.getTypes();
};
