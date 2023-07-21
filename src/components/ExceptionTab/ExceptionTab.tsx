import { Skeleton } from "@mui/material";
import CodeBlock from "components/CodeBlock";
import { memo } from "react";
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
    displayCode =
      message.substr(0, message.length - 1) + "\n" + displayCode.join(",");
  }
  return displayCode ? (
    <div className={styles.container}>
      <label className={styles.label}>Exception:</label>
      <div className={styles.value}>
        <CodeBlock code={displayCode} allowCopy color="light" />
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <Skeleton variant="rectangular" className={styles.skeleton} />
    </div>
  );
};

export default memo(ExceptionTab);
