import Link from "next/link";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import styles from "./ErrorBoundary.module.scss";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const ErrorFallback = () => {
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
  return (
    <ReactErrorBoundary fallbackRender={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
