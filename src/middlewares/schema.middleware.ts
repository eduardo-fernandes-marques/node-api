import { ValidationError, ObjectSchema, Schema } from "joi";
import { NextFunction, Request, Response } from "express";

import { Schema as SchemaError } from "#/models/errors/schema.error";

type Joi<T> = {
  value: T;
  error?: ValidationError;
};

type SchemaObjectMiddleware<T> = {
  schema: ObjectSchema<T>;
} & Omit<SchemaMiddleware, "schema">;

type SchemaMiddleware = {
  schema: Schema;
  friendlyMsg?: string;
};

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

export const requestBody = <T>({
  schema,
  friendlyMsg,
}: SchemaObjectMiddleware<T>) => (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  request.body = handleSchema(
    next,
    schema.validate(request.body, options),
    friendlyMsg
  );

  next();
};

export const requestQuery = ({ schema, friendlyMsg }: SchemaMiddleware) => (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  request.query = handleSchema(
    next,
    schema.validate(request.query, options),
    friendlyMsg
  );

  next();
};


export const requestParams = ({ schema, friendlyMsg }: SchemaMiddleware) => (
  request: Request,
  _: Response,
  next: NextFunction
) => {

  request.query = handleSchema(
    next,
    schema.validate(request.params, options),
    friendlyMsg
  );

  next();
};

const handleSchema = <T>(
  next: NextFunction,
  { error, value }: Joi<T>,
  friendlyMsg?: string
) => {
  if (error) {
    const errorDetails = error.details.reduce(
      (acc, { path, message, context }) => {
        const key = context?.key || path.shift() || "conditions";

        if (acc[key]) {
          acc[key].push(
            message
              .trim()
              .replace("/", "")
              .replace(/\\/, "")
              .replace(/['"]+/g, "")
          );
        }

        return !acc[key]
          ? {
              ...acc,
              [key]: [
                message
                  .trim()
                  .replace("/", "")
                  .replace(/\\/, "")
                  .replace(/['"]+/g, ""),
              ],
            }
          : acc;
      },
      [] as any
    );

    return next(
      new SchemaError({
        status: 422,
        message: friendlyMsg,
        details: errorDetails,
      })
    );
  }

  return value;
};
