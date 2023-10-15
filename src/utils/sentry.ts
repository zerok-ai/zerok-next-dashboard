import * as Sentry from "@sentry/nextjs";

export const sendError = (error: any) => {
  try {
    Sentry.captureException(error);
  } catch (err) {
    console.error(err);
  }
};
