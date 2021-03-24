import { NextFunction, Request, Response } from "express";

export const authenticate = (_: Request, __: Response, next: NextFunction) => {
  //TODO: validation

  next();
};
