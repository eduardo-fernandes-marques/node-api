import EcsMeta from "~/ecs-meta.json";
import applicationDev from "~/properties/dev.json";

type LogLevel =
  | "silent"
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

export const ENVIROMENT = {
  dev: "dev",
  tst: "tst",
  uat: "uat",
  test: "test",
  prd: "prd",
};

export type Environment = keyof typeof ENVIROMENT;

export const isProd = () => process.env.NODE_ENV === "production";

export const config = {
  apiPath: "api",
  roles: ["test"],
  swaggerRoute: "/docs",
  apiName: EcsMeta.service_name,
  vaultAuth: process.env.VAULT_AUTH,
  serverPort: process.env.SERVER_PORT,
  apiVersion: process.env.MAJOR_VERSION,
  vaultServer: process.env.VAULT_SERVER,
  consulServer: process.env.CONSUL_SERVER,
  script: process.env.npm_lifecycle_event,
  consulAclToken: process.env.CONSUL_ACL_TOKEN,
  loggerLevel: process.env.LOGGER_LEVEL || ("debug" as LogLevel),
  unprotectedEndpoints: [new RegExp(/^\/api\/v(.*)\/health$/gi)],
  jaeger: {
    serviceName: process.env.OTEL_JAEGER_SERVICE_NAME || "",
    endpoint: (() => {
      let url: string | URL = process.env.OTEL_JAEGER_ENDPOINT || "http://localhost:3000";

      if (!/^https?:\/\//i.test(url)) {
        url = `http://${url}`;
      }

      url = new URL("/api/traces", url);

      url.port = "14268";

      return url.toString();
    })(),
  },
};

export const ERROR_MESSAGES = {
  INVALID_SEARCH: "Busca inválida",
  INVALID_REQUEST: "Requisição inválida",
};

export type ApplicationType =
  | "PRICING"
  | "PRODUCT"
  | "GUARANTEE"
  | "ORGANIZATION";

export const APPLICATION: { [K in ApplicationType]: K } = {
  PRICING: "PRICING",
  PRODUCT: "PRODUCT",
  GUARANTEE: "GUARANTEE",
  ORGANIZATION: "ORGANIZATION",
};

export type Application = {
  url: {
    [key: string]: string;
  };
};

export const getApplication = (application: ApplicationType): string => {
  const devUrl = (applicationDev as Application).url[application.toLowerCase()];

  return process.env[application] || devUrl;
};

export const getUri = (path?: string) =>
  `/${config.apiPath}/${config.apiVersion}/${path || ""}`;
