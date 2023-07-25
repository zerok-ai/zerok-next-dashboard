import { Skeleton } from "@mui/material";
import { memo } from "react";
import { type GenericObject, type SpanRawDataResponse } from "utils/types";

import styles from "./ExceptionTab.module.scss";
import { nanoid } from "nanoid";

interface ExceptionTabProps {
  exceptionSpan: SpanRawDataResponse;
}

const ExceptionTab = ({ exceptionSpan }: ExceptionTabProps) => {
  const exceptionData = exceptionSpan[Object.keys(exceptionSpan)[0]];
  const data: string | undefined = (
    exceptionData.request_payload as GenericObject
  )?.req_body;
  if (!data) {
    return (
      <div className={styles.container}>
        <Skeleton variant="rectangular" className={styles.skeleton} />
      </div>
    );
  }
  const messagePos = data.indexOf("], message=");
  const traceStr = data.substring(13, messagePos);
  const traceMsg = data.substring(messagePos + 11, data.length - 1);
  const stacktrace = traceStr.split(",");
  const splitTrace = (trace: string) => {
    const regex = /^(.*)[(](.*)(:(.*))?[)]$/;

    const traceItems = regex.exec(trace);
    if (!traceItems) {
      return {
        text: trace,
      };
    }
    return {
      text: traceItems[1],
      file: traceItems[2].split(":")[0],
      line: traceItems[2].split(":")[1],
    };
  };
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <label className={styles.label}>Message:</label>
        <div className={styles.data}>{traceMsg}</div>
      </div>
      <div className={styles.row}>
        <label className={styles.label}>Exception:</label>
        <div className={styles["exception-rows"]}>
          {stacktrace.map((trace) => {
            const { text, file, line } = splitTrace(trace);
            return (
              <span key={nanoid()} className={styles["exception-row"]}>
                <span>{text}</span>{" "}
                <span className={styles["exception-helper-text"]}>in file</span>{" "}
                <span>{file}</span>{" "}
                {line && (
                  <span>
                    <span className={styles["exception-helper-text"]}>
                      at line
                    </span>{" "}
                    <span>{line}</span>
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(ExceptionTab);
