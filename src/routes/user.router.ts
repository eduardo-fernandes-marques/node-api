import { Router, Request, Response } from "express";

import { ERROR_MESSAGES } from "#/config/constants";
import { getUser, createUser } from "#/controllers/user.controller";
import { getUserSchema, createUserSchema } from "#/models/schemas/user.schema";
import {
  requestBody as schemaRequestBody,
  requestParams as schemaRequestParams,
} from "#/middlewares/schema.middleware";

export const path = "/users";

export const router = Router();

router.route("/:userId").get(
  schemaRequestParams({
    schema: getUserSchema,
    friendlyMsg: ERROR_MESSAGES.INVALID_SEARCH,
  }),
  async (request: Request, response: Response) => {
    const userId = request.params["userId"];

    const user = await getUser(userId);

    return response.status(200).json({ user });
  }
);

router
  .route("/test/withoutFriendlyMessage/:userId")
  .get(schemaRequestParams({ schema: getUserSchema }));

router
  .route("/role/:userId")
  .get((_: Request, response: Response) => {
    return response.status(200).json({ message: "role" });
  });

router.route("/test/withoutFriendlyMessage").post(
  schemaRequestBody({
    schema: createUserSchema,
  })
);

router.route("/").post(
  schemaRequestBody({
    schema: createUserSchema,
    friendlyMsg: ERROR_MESSAGES.INVALID_REQUEST,
  }),
  async (request: Request, response: Response) => {
    await createUser({ ...request.body });

    return response.sendStatus(201);
  }
);

router.post("/handleError500", () => {
  throw new Error();
});

export default router;
