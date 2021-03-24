import EcsMeta from "~/ecs-meta.json";
import applicationDev from "~/properties/application-dev.json";

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
  swaggerRoute: "/docs",
  gitLabGroup: "@@APP_NAME@@",
  apiName: EcsMeta.service_name,
  roles: ["developer", "product_owner"],
  script: process.env.npm_lifecycle_event,
  serverPort: process.env.SERVER_PORT || "8080",
  apiVersion: process.env.MAJOR_VERSION || "v1",
  loggerLevel: process.env.LOGGER_LEVEL || ("debug" as LogLevel),
  unprotectedEndpoints: [new RegExp(/^\/api\/v(.*)\/health$/gi)],
  vaultServer: process.env.VAULT_SERVER || "vault.dev-sicredi.in",
  vaultAuth: process.env.VAULT_AUTH || "31f62b77-dd73-6f83-6571-a0d53d1eac26",
  consulAclToken: process.env.CONSUL_ACL_TOKEN || "ARuzMxhYTrKQdQe5fG5UC4tmcc",
  consulServer:
    process.env.CONSUL_SERVER || "http://dev-consul.dev-sicredi.in:8500",
  jaeger: {
    serviceName:
      process.env.OTEL_JAEGER_SERVICE_NAME || "credit-pricing-bo-bff-v1",
    endpoint: (() => {
      let url: string | URL =
        process.env.OTEL_JAEGER_ENDPOINT ||
        "http://tracing-collector.dev-sicredi.in:14268/";

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
