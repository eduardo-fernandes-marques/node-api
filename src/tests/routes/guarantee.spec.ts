import nockType from "nock";
import request from "supertest";
import { Request, Response, NextFunction } from "express";

import app from "#/app";
import { paths } from "#/services/guarantee.service";
import fixtures from "#/config/server/fixtures.json";
import { createServer, Server } from "#/config/server";
import { getUri, APPLICATION } from "#/config/constants";
import { path, getTypesEndpoint } from "#/routes/guarantee.router";

jest.mock("@sicredi/express-security", () => ({
  ...(jest.requireActual("@sicredi/express-security") as {}),
  authenticate: jest.fn(
    () => (_: Request, __: Response, next: NextFunction) => {
      return next();
    }
  ),
}));

describe("routes › guarantee", () => {
  let { nock, server } = {} as { nock: typeof nockType; server: Server };

  beforeEach(() => {
    const create = createServer([APPLICATION.GUARANTEE]);

    nock = create.nock;
    server = create.server;
  });

  describe("GET", () => {
    it("guarantees/types › should handle", async (done) => {
      request(app())
        .get(getUri(`${path}/${getTypesEndpoint()}`))
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual(fixtures.service.guarantee.types);

          done();
        });
    });

    it("guarantees/types › should handle error", async (done) => {
      nock.cleanAll();

      server.GUARANTEE.get((uri) => uri.includes(paths.types)).reply(
        500,
        "Internal Server Error"
      );

      request(app())
        .get(getUri(`${path}/${getTypesEndpoint()}`))
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
