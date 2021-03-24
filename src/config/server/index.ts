import nock, { Scope } from "nock";

import { paths as pricingPaths } from "#/services/pricing.service";
import { paths as productPaths } from "#/services/product.service";
import { paths as guaranteePaths } from "#/services/guarantee.service";
import { paths as organizationPaths } from "#/services/organization.service";
import { getApplication, ApplicationType, APPLICATION } from "#/config/constants";

import fixtures from "./fixtures.json";

export type Server = {
  [APPLICATION.PRICING]: Scope;
  [APPLICATION.PRODUCT]: Scope;
  [APPLICATION.GUARANTEE]: Scope;
  [APPLICATION.ORGANIZATION]: Scope;
};

const server = {
  [APPLICATION.PRODUCT]: nock(
    getApplication(APPLICATION.PRODUCT as ApplicationType),
    { allowUnmocked: true }
  ).persist(),
  [APPLICATION.PRICING]: nock(
    getApplication(APPLICATION.PRICING as ApplicationType),
    { allowUnmocked: true }
  ).persist(),
  [APPLICATION.GUARANTEE]: nock(
    getApplication(APPLICATION.GUARANTEE as ApplicationType),
    { allowUnmocked: true }
  ).persist(),
  [APPLICATION.ORGANIZATION]: nock(
    getApplication(APPLICATION.ORGANIZATION as ApplicationType),
    { allowUnmocked: true }
  ).persist(),
} as Server;

export const createServer = (
  applications: ApplicationType[] = [
    ...Object.keys(APPLICATION),
  ] as ApplicationType[]
) => {
  if (applications.includes(APPLICATION.GUARANTEE)) {
    server.GUARANTEE.get((uri) => uri.includes(guaranteePaths.types)).reply(
      200,
      fixtures.service.guarantee.types
    );
  }

  if (applications.includes(APPLICATION.PRICING)) {
    server.PRICING.put((uri) => uri.includes(pricingPaths.update)).reply(
      200,
      fixtures.service.pricing.update
    );

    server.PRICING.post((uri) => uri.includes(pricingPaths.insert)).reply(
      200,
      fixtures.service.pricing.insert
    );

    server.PRICING.delete((uri) => uri.includes(pricingPaths.delete)).reply(
      204
    );

    server.PRICING.get((uri) => uri.includes(pricingPaths.pricings)).reply(
      200,
      fixtures.service.pricing.pagination
    );

    server.PRICING.get((uri) => uri.includes(pricingPaths.amc)).reply(
      200,
      fixtures.service.pricing.averageMinimumCost
    );

    server.PRICING.get((uri) => uri.includes(pricingPaths.get)).reply(
      200,
      fixtures.service.pricing.get
    );

    server.PRICING.get((uri) =>
      uri.includes(pricingPaths.productPricing)
    ).reply(200, fixtures.service.pricing.productPricing);
  }

  if (applications.includes(APPLICATION.PRODUCT)) {
    server.PRODUCT.get((uri) => uri.includes(productPaths.get)).reply(
      200,
      fixtures.service.product.cas
    );

    server.PRODUCT.get((uri) => uri.includes(productPaths.getByCoop)).reply(
      200,
      fixtures.service.product.byCoop
    );
  }

  if (applications.includes(APPLICATION.ORGANIZATION)) {
    server.ORGANIZATION.get((uri) =>
      uri.includes(organizationPaths.entity)
    ).reply(200, fixtures.service.organization.entity);
  }

  return { nock, server };
};
