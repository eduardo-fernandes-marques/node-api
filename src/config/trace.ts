import { NodeTracerProvider } from "@opentelemetry/node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { JaegerHttpTracePropagator } from "@opentelemetry/propagator-jaeger";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/tracing";
import {
  ExpressLayerType,
  ExpressInstrumentation,
  ExpressInstrumentationConfig,
} from "@opentelemetry/instrumentation-express";
import {
  diag,
  context,
  DiagLogLevel,
  DiagConsoleLogger,
  getSpan as getSpanApi,
  getSpanContext as getSpanContextApi,
} from "@opentelemetry/api";

import { isProd } from "./constants";

export type JaegerConfig = {
  endpoint: string;
  serviceName: string;
};

export type TraceConfig = {
  jaeger: JaegerConfig;
  config?: ExpressInstrumentationConfig;
};

export const LayerType = ExpressLayerType;

export const init = ({ jaeger, config }: TraceConfig) => {
  const tracerProvider = new NodeTracerProvider();

  if (!isProd()) {
    tracerProvider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter())
    );
  }

  tracerProvider.addSpanProcessor(
    new SimpleSpanProcessor(
      new JaegerExporter({
        ...jaeger,
      })
    )
  );

  tracerProvider.register({
    propagator: new JaegerHttpTracePropagator(),
  });

  registerInstrumentations({
    tracerProvider,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation({ ...config }),
      {
        plugins: {
          dns: { enabled: false, path: "@opentelemetry/plugin-dns" },
          http: { enabled: false, path: "@opentelemetry/plugin-http" },
          https: { enabled: false, path: "@opentelemetry/plugin-https" },
          express: { enabled: false, path: "@opentelemetry/plugin-express" },
        },
      },
    ],
  });

  // logger
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);
};

export const getSpan = () => getSpanApi(context.active());

export const getSpanContext = () => getSpanContextApi(context.active());
