import { Router, Request, Response, NextFunction } from "express";

import { getTypes } from "#/controllers/guarantee.controller";

export const path = "/guarantees";

export const getTypesEndpoint = () => "/types";

export const router = Router();

router
  .route(getTypesEndpoint())
  .get(async (_: Request, response: Response, next: NextFunction) => {
    try {
      const guaranteeTypes = await getTypes();

      return response.status(200).json(guaranteeTypes);
    } catch (error) {
      return next(error);
    }
  });

export default router;