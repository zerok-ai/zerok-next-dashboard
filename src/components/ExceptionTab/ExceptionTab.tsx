import { Skeleton } from "@mui/material";
import CodeBlock from "components/CodeBlock";
import { Fragment, memo } from "react";
import { type GenericObject, type SpanRawDataResponse } from "utils/types";

import styles from "./ExceptionTab.module.scss";

interface ExceptionTabProps {
  exceptionSpan: SpanRawDataResponse;
}

const ExceptionTab = ({ exceptionSpan }: ExceptionTabProps) => {
  const exceptionData = exceptionSpan[Object.keys(exceptionSpan)[0]];
  let displayCode: string | string[] | undefined = (
    exceptionData.request_payload as GenericObject
  )?.req_body;
  let message;
  if (displayCode !== undefined) {
    displayCode = (displayCode as string).substr(12);
    displayCode = displayCode.split(",");
    message = displayCode[displayCode.length - 1];
    displayCode = displayCode.join(",");
  }
  return displayCode ? (
    <div className={styles.container}>
      {message && (
        <div className={styles.row}>
          <label className={styles.label}>Message:</label>
          <div className={styles.value}>
            {message.substr(9, message.length)}
          </div>
        </div>
      )}
      <div className={styles.row}>
        <label className={styles.label}>Exception:</label>
        <div className={styles.value}>
          <CodeBlock code={displayCode} allowCopy color="light" />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <Skeleton variant="rectangular" className={styles.skeleton} />
    </div>
  );
};

export default memo(ExceptionTab);
