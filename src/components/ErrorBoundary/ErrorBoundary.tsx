"use client";
import Link from "next/link";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { sendError } from "utils/sentry";

import styles from "./ErrorBoundary.module.scss";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorFallback = () => {
  // console.log("ERRO");
  return (
    <div className={styles.container}>
      <div className={styles["error-container"]}>
        <h6>
          Something went wrong, please click <Link href="/">here</Link> to go
          back to the home page.
        </h6>
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return (
    <ReactErrorBoundary
      fallbackRender={ErrorFallback}
      onError={(err) => {
        sendError(err);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
