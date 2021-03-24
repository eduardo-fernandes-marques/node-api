import { Router, Request, Response, NextFunction } from "express";

import {
  get,
  insert,
  update,
  remove,
  getAverageMinimumCost,
} from "#/controllers/pricing.controller";

export const path = "/pricing";

export const getEndpoint = () => "/:id";

export const deleteEndpoint = () => "/:id";

export const insertEndpoint = () => "/";

export const updateEndpoint = () => "/";

export const getAverageMinimumCostEndpoint = () => "/:id/amc";

export const router = Router();

router
  .route(getEndpoint())
  .get(async (request: Request, response: Response, next: NextFunction) => {
    try {
      const pricing = await get(request.params.id);

      return response.status(200).json(pricing);
    } catch (error) {
      return next(error);
    }
  });

router
  .route(deleteEndpoint())
  .delete(async (request: Request, response: Response, next: NextFunction) => {
    try {
      await remove(request.params.id);

      return response.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  });

router
  .route(insertEndpoint())
  .post(async (request: Request, response: Response, next: NextFunction) => {
    try {
      const pricing = await insert(request.body);

      return response.status(201).json(pricing);
    } catch (error) {
      return next(error);
    }
  });

router
  .route(updateEndpoint())
  .put(async (request: Request, response: Response, next: NextFunction) => {
    try {
      const pricing = await update(request.body);

      return response.status(200).json(pricing);
    } catch (error) {
      return next(error);
    }
  });

router
  .route(getAverageMinimumCostEndpoint())
  .get(async (request: Request, response: Response, next: NextFunction) => {
    try {
      const averageMinimumCost = await getAverageMinimumCost({
        id: request.params.id,
        coop: request.headers.coop,
      });

      return response.status(200).json(averageMinimumCost);
    } catch (error) {
      return next(error);
    }
  }
);
