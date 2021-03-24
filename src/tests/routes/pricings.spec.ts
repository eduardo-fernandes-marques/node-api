import nockType from "nock";
import request from "supertest";
import { Request, Response, NextFunction } from "express";

import app from "#/app";
import { paths } from "#/services/pricing.service";
import { mapPricing } from "#/models/pricing.model";
import fixtures from "#/config/server/fixtures.json";
import { mapPricings } from "#/models/pricings.model";
import { createServer, Server } from "#/config/server";
import { getUri, APPLICATION } from "#/config/constants";
import { path, getPricingsEndpoint } from "#/routes/pricings.router";
import { PricingPaginationResponse } from "#/models/services/pricing.model";

jest.mock("@sicredi/express-security", () => ({
  ...(jest.requireActual("@sicredi/express-security") as {}),
  authenticate: jest.fn(
    () => (_: Request, __: Response, next: NextFunction) => {
      return next();
    }
  ),
}));

describe("routes › pricings", () => {
  let { nock, server } = {} as { nock: typeof nockType; server: Server };

  beforeEach(() => {
    const create = createServer([APPLICATION.PRICING, APPLICATION.PRODUCT]);

    nock = create.nock;
    server = create.server;
  });

  describe("GET", () => {
    it("pricings › should handle", async (done) => {
      request(app())
        .get(getUri(`${path}/${getPricingsEndpoint()}`))
        .query({
          size: fixtures.service.pricing.pagination.size,
          page: fixtures.service.pricing.pagination.number,
        })
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual(
            mapPricings(
              fixtures.service.product.cas,
              mapPricing(
                fixtures.service.pricing.pagination
              ) as PricingPaginationResponse
            )
          );

          done();
        });
    });

    it("pricings › should handle error", async (done) => {
      nock.cleanAll();

      server.PRICING.get((uri) => uri.includes(paths.pricings)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .get(getUri(`${path}/${getPricingsEndpoint()}`))
        .query({
          size: fixtures.service.pricing.pagination.size,
          page: fixtures.service.pricing.pagination.number,
        })
        .expect(500)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.text).toBe("Internal Server Error");

          done();
        });
    });
  });
});
