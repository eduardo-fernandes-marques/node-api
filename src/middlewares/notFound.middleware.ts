import { Request, Response } from "express";

export const notFound = (_: Request, response: Response) =>
  response.sendStatus(404);
