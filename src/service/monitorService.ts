import * as Sentry from "@sentry/bun";

if (process.env.SENTRY_DSN !== undefined)
    Sentry.init({
        dsn: process.env.SENTRY_DSN,

        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions


        // Tells which environment the data is coming from
        environment: 'production', // TODO Get environment from .env here
    }); 
