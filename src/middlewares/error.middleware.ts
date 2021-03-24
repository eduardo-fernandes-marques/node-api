import { HTTPError, RequestError } from "got";
import { Request, Response, NextFunction } from "express";

import { getSpan } from "#/config/trace";
import { isProd } from "#/config/constants";
import { Schema as SchemaError } from "#/models/errors/schema.error";

import { createLogger } from "./logger.middleware";

export const error = (
  error: any,
  _: Request,
  response: Response,
  __: NextFunction
): Response | void => {
  /* istanbul ignore next */
  if (!isProd()) createLogger.error(error);

  const span = getSpan();

  if (error instanceof SchemaError) {
    span?.recordException(new Error(error.message));

    return response
      .status(error.status)
      .json({ message: error.message || error.details });
  }

  if (error instanceof HTTPError) {
    const message = error.response.body as string;

    const result = response.status(error.response.statusCode);

    span?.recordException(new Error(message));

    try {
      return result.json(JSON.parse(message));
    } catch (_) {
      return result.send(message);
    }
  }

  if (error instanceof RequestError) {
    const code = error.response?.statusCode || Number(error.code || "500");
    const message = error.message || (error.response?.body as string);

    span?.recordException(new Error(message));

    if (error.code === "ERR_NOCK_NO_MATCH") return response.sendStatus(404);

    return response.status(code).json(JSON.parse(message));
  }

  return response.sendStatus(500);
};
