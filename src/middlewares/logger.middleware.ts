import winston from "winston";
import { Request, Response, NextFunction } from "express";

import { config, isProd } from "#/config/constants";

const prettyJson = winston.format.printf((info) => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4);
  }
  return `${info.timestamp} ${info.label || "-"} ${info.level}: ${
    info.message
  }`;
});

export const createLogger = winston.createLogger({
  level: config.loggerLevel === "silent" ? undefined : config.loggerLevel,
  silent: config.loggerLevel === "silent",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    prettyJson
  ),
  defaultMeta: { service: "api-example" },
  transports: [new winston.transports.Console({})],
});

export const logger = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (!isProd()) {
    return next();
  }

  const startHrTime = process.hrtime();

  createLogger.http(
    `Request: ${request.method} ${
      request.url
    } at ${new Date().toUTCString()}, User-Agent: ${request.get("User-Agent")}`
  );
  
  createLogger.http(`Request Body: ${JSON.stringify(request.body)}`);

  const [oldWrite, oldEnd] = [response.write, response.end];
  const chunks: Buffer[] = [];

  (response.write as unknown) = function (chunk: any): void {
    chunks.push(Buffer.from(chunk));

    (oldWrite as Function).apply(response, arguments);
  };

  response.end = function (chunk: any): void {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }

    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    createLogger.http(
      `Response ${response.statusCode} ${elapsedTimeInMs.toFixed(3)} ms`
    );

    const body = Buffer.concat(chunks).toString("utf8");

    createLogger.http(`Response Body: ${body}`);

    (oldEnd as Function).apply(response, arguments);
  };

  next();
};
