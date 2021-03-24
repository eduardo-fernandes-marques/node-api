import request from "supertest";
import { Request, Response, NextFunction, response } from "express";

import app from "#/app";
import fixtures from "#/config/server/fixtures.json";
import { getUri, ERROR_MESSAGES } from "#/config/constants";

let authorization = true;

jest.mock("authenticate", () => ({
  ...(jest.requireActual("authenticate") as {}),
  authenticate: jest.fn(
    () => (_: Request, __: Response, next: NextFunction) => {
      if (!authorization) return response.status(403).end();
      return next();
    }
  ),
}));

describe("routes › user", () => {
  describe("GET", () => {
    it("users/role/:userId › should handle", async (done) => {
      request(app())
        .get(getUri("users/role/123"))
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual({ message: "role" });

          done();
        });
    });

    it("users/role/:userId › should handle authentication error ", async (done) => {
      authorization = false;

      request(app())
        .get(getUri("users/role/1234"))
        .expect(403)
        .end((error, _) => {
          if (error) return done(error);

          done();
        });
    });

    it("users/:userId › should handle", async () => {
      const result = await request(app()).get(getUri("users/123")).send();

      expect(result.status).toBe(200);
      expect(result.body).toStrictEqual({ user: { ...fixtures.user } });
    });

    it("users/test/withoutFriendlyMessage/:userId › should handle schema error without friendly message", async () => {
      const result = await request(app())
        .get(getUri("users/test/withoutFriendlyMessage/1"))
        .send();

      expect(result.status).toBe(422);
      expect(result.body).toStrictEqual({
        message: {
          userId: ["userId length must be at least 2 characters long"],
        },
      });
    });

    it("users/:userId › should handle schema error", async () => {
      const result = await request(app()).get(getUri("users/1")).send();

      expect(result.status).toBe(422);
      expect(result.body).toStrictEqual({
        message: ERROR_MESSAGES.INVALID_SEARCH,
      });
    });
  });

  describe("POST", () => {
    it("users › should handle", async (done) => {
      request(app())
        .post(getUri("users"))
        .send({
          ...fixtures.user,
        })
        .expect(201)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.text).toBe("Created");

          done();
        });
    });

    it("users/test/withoutFriendlyMessage › should handle schema error without friendly message", async (done) => {
      const fixture = {
        ...fixtures.user,
        userId: "1",
        description: "1",
        email: undefined,
      };

      request(app())
        .post(getUri("users/test/withoutFriendlyMessage"))
        .send({
          ...fixture,
        })
        .expect(422)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual({
            message: {
              conditions: ["value must contain at least one of [id, email]"],
              email: ["email is required"],
              description: [
                "description length must be at least 2 characters long",
                "description length must be less than or equal to 0 characters long",
              ],
            },
          });

          done();
        });
    });

    it("users › should handle schema error", async (done) => {
      const fixture = { ...fixtures.user, name: undefined };

      request(app())
        .post(getUri("users"))
        .send({
          ...fixture,
        })
        .expect(422)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toStrictEqual({
            message: ERROR_MESSAGES.INVALID_REQUEST,
          });

          done();
        });
    });
  });
});
