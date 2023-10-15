import { Tab, Tabs } from "@mui/material";
import CustomSkeleton from "components/custom/CustomSkeleton";
import { nanoid } from "nanoid";
import { Fragment, memo, useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_ERROR_DETAILS_ENDPOINT } from "utils/endpoints";
import raxios from "utils/raxios";
import { sendError } from "utils/sentry";
import { type SpanErrorDetail } from "utils/types";

import styles from "./ExceptionTab.module.scss";

interface ExceptionTabProps {
  errors: SpanErrorDetail[];
}
interface ErrorDataType {
  id: string;
  data: string;
}

const ExceptionTab = ({ errors }: ExceptionTabProps) => {
  const { selectedCluster } = useSelector(clusterSelector);
  const [activeTab, setActiveTab] = useState(errors[0].hash);
  const [errorData, setErrorData] = useState<ErrorDataType[] | null>(null);
  const [disabledCard] = useState(false);
  const fetchErrors = async () => {
    try {
      const endpoint = GET_ERROR_DETAILS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster!
      );
      const body = {
        id_list: errors.map((er) => er.hash),
      };
      const rdata = await raxios.post(endpoint, body);
      setErrorData(rdata.data.payload.errors);
    } catch (err) {
      sendError(err);
    }
  };

  useEffect(() => {
    if (selectedCluster && activeTab) {
      fetchErrors();
    }
  }, [selectedCluster, activeTab, errors]);
  // const exceptionData =
  // exceptionSpan && exceptionSpan[Object.keys(exceptionSpan)[0]];
  // const data = exceptionData?.req_body as string;
  if (disabledCard) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h6>Exceptions</h6>
        </div>
        <div className={styles.content}>
          <div className={styles.tabs}>
            This feature is disabled for your organisation. Please contact ZeroK
            to know more.
          </div>
        </div>
      </div>
    );
  }
  // const messagePos = data.indexOf("], message=");
  // const traceStr = data.substring(13, messagePos);
  // const traceMsg = data.substring(messagePos + 11, data.length - 1);
  // const stacktrace = traceStr.split(",");
  const splitTrace = (trace: string) => {
    const regex = /([a-zA-Z_.]+)\(([^:]+):(\d+)\)/;
    const match = trace.match(regex);
    if (match) {
      const text = match[1].replace(`(${match[2]})`, "");
      const file = match[2];
      const line = parseInt(match[3], 10);
      return {
        text,
        file,
        line,
      };
    } else {
      return {
        text: trace,
      };
    }
  };
  const renderExceptionData = () => {
    const exception = errorData?.find((er) => er.id === activeTab);
    if (!exception) {
      return <CustomSkeleton len={8} />;
    } else {
      try {
        const data = JSON.parse(exception.data);
        const stacktrace: string[] = data.stacktrace.split("\tat");
        return (
          <div className={styles["exception-rows"]}>
            {stacktrace.map((trace: string) => {
              const { text, file, line } = splitTrace(trace);
              text.replace("\t", "");
              return (
                <span key={nanoid()} className={styles["exception-row"]}>
                  <span>{text}</span>
                  {file && (
                    <Fragment>
                      <span className={styles["exception-helper"]}> in </span>
                      <span>{file}</span>
                    </Fragment>
                  )}
                  {line && (
                    <Fragment>
                      <span className={styles["exception-helper"]}>
                        {" "}
                        at line{" "}
                      </span>
                      <span>{line}</span>
                    </Fragment>
                  )}
                </span>
              );
            })}
          </div>
        );
      } catch (err) {
        return <p>{exception.data}</p>;
      }
    }
  };
  const renderTab = () => {
    const activeError = errors.find((er) => er.hash === activeTab);
    if (!activeError) {
      return null;
    }
    const { message, exception_type } = activeError;
    return (
      <div className={styles["tab-content"]}>
        <div className={styles.row}>
          <label className={styles.label}>Message:</label>
          <div className={styles.data}>{message}</div>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Exception Type:</label>
          <div className={styles.data}>{exception_type}</div>
        </div>
        <div className={styles.row}>
          <label>Exception:</label>
          <div className={styles.data}>{renderExceptionData()}</div>
        </div>
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Exceptions</h6>
      </div>
      <div className={styles.content}>
        <Tabs
          className={styles.tabs}
          value={activeTab}
          onChange={(e, val) => {
            setActiveTab(val);
          }}
        >
          {errors.map((er, idx) => {
            return (
              <Tab
                label={er.source ? er.source : `Error ${idx + 1}`}
                key={er.hash}
                value={er.hash}
              />
            );
          })}
        </Tabs>
        <div className={styles["tab-content"]}>{renderTab()}</div>
        {/* <div className={styles.row}>
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
                  <span className={styles["exception-helper-text"]}>
                    in file
                  </span>{" "}
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
        </div> */}
      </div>
    </div>
  );
};

export default memo(ExceptionTab);
