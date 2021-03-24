import request from "supertest";
import { Request, Response, NextFunction } from "express";

import app from "#/app";
import { getUri } from "#/config/constants";

jest.mock("@sicredi/express-security", () => ({
  ...(jest.requireActual("@sicredi/express-security") as {}),
  authenticate: jest.fn(() => (_: Request, __: Response, next: NextFunction) => {
    return next();
  }),
}));

describe("routes", () => {
  it("routes › should handle not found", async (done) => {
    request(app())
      .get(getUri("test/"))
      .expect(404)
      .end((error, response) => {
        if (error) return done(error);

        expect(response.text).toBe("Not Found");

        done();
      });
  });

  it("routes › should handle internal server error", async (done) => {
    request(app())
      .post(getUri("users/handleError500"))
      .expect(500)
      .end((error, response) => {
        if (error) return done(error);

        expect(response.status).toBe(500);
        expect(response.text).toContain("Internal Server Error");

        done();
      });
  });
});
