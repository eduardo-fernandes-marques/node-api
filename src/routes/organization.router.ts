import { Router, Request, Response, NextFunction } from "express";

import { mapEntity } from "#/models/organization.model";
import { getEntity } from "#/controllers/organization.controller";

export const path = "/organizations";

export const getEntityEndpoint = () => "/entities/:id";

export const router = Router();

router
  .route(getEntityEndpoint())
  .get(async (request: Request, response: Response, next: NextFunction) => {
    /* 	#swagger.tags = ['Organization']
        #swagger.description = 'Endpoint to get  a specific entity' */

    try {
      const entity = await getEntity(request.params.id);

      return response.status(200).json(mapEntity(entity));
    } catch (error) {
      return next(error);
    }
  });

export default router;
