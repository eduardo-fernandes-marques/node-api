import nockType from "nock";
import request from "supertest";
import { Request, Response, NextFunction } from "express";

import app from "#/app";
import { paths } from "#/services/product.service";
import fixtures from "#/config/server/fixtures.json";
import { createServer, Server } from "#/config/server";
import { getUri, APPLICATION } from "#/config/constants";
import { path, getEndpoint, getByCoopEndpoint } from "#/routes/product.router";

jest.mock("authenticate", () => ({
  ...(jest.requireActual("authenticate") as {}),
  authenticate: jest.fn(
    () => (_: Request, __: Response, next: NextFunction) => {
      return next();
    }
  ),
}));

describe("routes › product", () => {
  let { nock, server } = {} as { nock: typeof nockType; server: Server };

  beforeEach(() => {
    const create = createServer([APPLICATION.PRODUCT]);

    nock = create.nock;
    server = create.server;
  });

  describe("GET", () => {
    it("products/:id › should handle", async (done) => {
      request(app())
        .get(getUri(`${path}/${getEndpoint()}`))
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual(fixtures.service.product.father);

          done();
        });
    });

    it("products/:id › should handle error", async (done) => {
      nock.cleanAll();

      server.PRODUCT.get((uri) => uri.includes(paths.get)).reply(
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

    it("products/:id/coop/:coop › should handle", async (done) => {
      request(app())
        .get(getUri(`${path}/${getByCoopEndpoint()}`))
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual(fixtures.service.product.child);

          done();
        });
    });

    it("products/:id/coop/:coop › should handle error", async (done) => {
      nock.cleanAll();

      server.PRODUCT.get((uri) => uri.includes(paths.getByCoop)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .get(getUri(`${path}/${getByCoopEndpoint()}`))
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
