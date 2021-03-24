import nockType from "nock";
import request from "supertest";
import { Request, Response, NextFunction } from "express";

import app from "#/app";
import { paths } from "#/services/pricing.service";
import fixtures from "#/config/server/fixtures.json";
import { createServer, Server } from "#/config/server";
import { getUri, APPLICATION } from "#/config/constants";
import {
  path,
  getEndpoint,
  updateEndpoint,
  insertEndpoint,
  deleteEndpoint,
  getAverageMinimumCostEndpoint,
} from "#/routes/pricing.router";

jest.mock("@sicredi/express-security", () => ({
  ...(jest.requireActual("@sicredi/express-security") as {}),
  authenticate: jest.fn(
    () => (_: Request, __: Response, next: NextFunction) => {
      return next();
    }
  ),
}));

describe("routes › pricing", () => {
  let { nock, server } = {} as { nock: typeof nockType; server: Server };

  beforeEach(() => {
    const create = createServer([APPLICATION.PRICING]);

    nock = create.nock;
    server = create.server;
  });

  describe("GET", () => {
    it("pricings/:id › should handle", async (done) => {
      request(app())
        .get(getUri(`${path}/${getEndpoint()}`))
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual(fixtures.service.pricing.get);

          done();
        });
    });

    it("pricings/:id › should handle error", async (done) => {
      nock.cleanAll();

      server.PRICING.get((uri) => uri.includes(paths.get)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .get(getUri(`${path}/${getEndpoint()}`))
        .expect(500)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.status).toBe(500);
          expect(response.text).toContain("Internal Server Error");

          done();
        });
    });

    it("pricings/:id/amc › should handle", async (done) => {
      request(app())
        .get(getUri(`${path}/${getAverageMinimumCostEndpoint()}`))
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual(
            fixtures.service.pricing.averageMinimumCost
          );

          done();
        });
    });

    it("pricings/:id/amc › should handle error", async (done) => {
      nock.cleanAll();

      server.PRICING.get((uri) => uri.includes(paths.amc)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .get(getUri(`${path}/${getAverageMinimumCostEndpoint()}`))
        .expect(500)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.status).toBe(500);
          expect(response.text).toContain("Internal Server Error");

          done();
        });
    });
  });

  describe("DELETE", () => {
    it("pricings/:id › should handle", async (done) => {
      request(app())
        .delete(getUri(`${path}/${deleteEndpoint()}`))
        .expect(204)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.text).toBe("");

          done();
        });
    });

    it("pricing/:id › should handle error", async (done) => {
      nock.cleanAll();

      server.PRICING.delete((uri) => uri.includes(paths.delete)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .delete(getUri(`${path}/${deleteEndpoint()}`))
        .expect(500)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.status).toBe(500);
          expect(response.text).toContain("Internal Server Error");

          done();
        });
    });
  });

  describe("POST", () => {
    it("pricings › should handle", async (done) => {
      request(app())
        .post(getUri(`${path}/${insertEndpoint()}`))
        .expect(201)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.text).toStrictEqual(
            JSON.stringify(fixtures.service.pricing.insert)
          );

          done();
        });
    });

    it("pricing › should handle error", async (done) => {
      nock.cleanAll();

      server.PRICING.post((uri) => uri.includes(paths.insert)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .post(getUri(`${path}/${insertEndpoint()}`))
        .expect(500)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.status).toBe(500);
          expect(response.text).toContain("Internal Server Error");

          done();
        });
    });
  });

  describe("PUT", () => {
    it("pricings › should handle", async (done) => {
      request(app())
        .put(getUri(`${path}/${updateEndpoint()}`))
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.text).toStrictEqual(
            JSON.stringify(fixtures.service.pricing.update)
          );

          done();
        });
    });

    it("pricing › should handle error", async (done) => {
      nock.cleanAll();

      server.PRICING.put((uri) => uri.includes(paths.update)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .put(getUri(`${path}/${updateEndpoint()}`))
        .expect(500)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.status).toBe(500);
          expect(response.text).toContain("Internal Server Error");

          done();
        });
    });
  });
});
