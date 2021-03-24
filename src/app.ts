import cors from "cors";
import express from "express";

import { router } from "#/routes";
import { createServer } from "#/config/server";
import { isProd, getUri, config } from "#/config/constants";
import { error, tracer, logger, authenticate } from "#/middlewares";

import swagger from "~/swagger.json";

const init = () => {
  const app = express();

  if (isProd()) {
    const { init } = require("#/config/base");

    Object.entries(init.getValues()).map(([key, value]) =>
      console.log(`${key}: ${JSON.stringify(value)}`)
    );

    const swaggerUi = require("swagger-ui-express");
    app.use(config.swaggerRoute, swaggerUi.serve, swaggerUi.setup(swagger));
  }

  if (!isProd()) createServer();

  app.use(logger, tracer, cors(), express.json(), authenticate);

  app.use(getUri(), router, error);

  return app;
};

export default init;
