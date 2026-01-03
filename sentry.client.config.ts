import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Capture Replay for 10% of all sessions,
    // plus 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps

    environment: process.env.NODE_ENV,

    // Optionally enable debug mode
    debug: false,

    // Filter out specific errors
    beforeSend(event, hint) {
        // Filter out known browser extension errors
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
            const message = String(error.message);
            if (
                message.includes('chrome-extension://') ||
                message.includes('moz-extension://') ||
                message.includes('safari-extension://')
            ) {
                return null;
            }
        }
        return event;
    },
});
