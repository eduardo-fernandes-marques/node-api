import { Request, Response, NextFunction } from "express";

import { getSpanContext } from "#/config/trace";

export const tracer = (
  request: Request,
  _: Response,
  next: NextFunction
): void => {
  request.traceId = getSpanContext()?.traceId;

  next();
};
