import cors from "cors";
import express from "express";
import { authenticate } from "@sicredi/express-security";

import { router } from "#/routes";
import { createServer } from "#/config/server";
import { error, tracer, logger } from "#/middlewares";
import { isProd, getUri, config } from "#/config/constants";

import swagger from "~/swagger.json";

const init = () => {
  const app = express();

  if (isProd()) {
    const {
      consoleMonkeyPatch,
      registerExceptionHandlers,
    } = require("@sicredi/node-logger");

    consoleMonkeyPatch();
    registerExceptionHandlers();

    const { init } = require("#/config/base");

    Object.entries(init.getValues()).map(([key, value]) =>
      console.log(`${key}: ${JSON.stringify(value)}`)
    );

    const swaggerUi = require("swagger-ui-express");
    app.use(config.swaggerRoute, swaggerUi.serve, swaggerUi.setup(swagger));
  }

  if (!isProd()) createServer();

  app.use(
    logger,
    tracer,
    cors(),
    express.json(),
    authenticate(config.consulServer, config.consulAclToken, {
      ignored: [...config.unprotectedEndpoints, config.swaggerRoute],
    }),
  );

  app.use(getUri(), router, error);
  
  return app;
};

export default init;
