import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

if (window.location.hostname != 'localhost') {
  Sentry.init({
    dsn: "https://21dd293a2f444a45a66dc5f738a702ff@o456287.ingest.sentry.io/5808829",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}