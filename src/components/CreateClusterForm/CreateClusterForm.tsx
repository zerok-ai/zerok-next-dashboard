import { useEffect, useMemo, useState } from "react";
import styles from "./CreateClusterForm.module.scss";

import cx from "classnames";
import CodeBlock from "components/CodeBlock";
import { Button, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { apiKeySelector } from "redux/apiKeys";
import { useSelector } from "redux/store";
import useStatus from "hooks/useStatus";
import { ApiKeyType } from "redux/types";
import raxios from "utils/raxios";
import { APIKEY_ENDPOINT } from "utils/endpoints";

const INSTALL_STEP = 0;
const RESTART_STEP = 1;

const CreateClusterForm = () => {
  const [apiKey, setApiKey] = useState<ApiKeyType | null>(null);
  const [activeStep, setActiveStep] = useState(INSTALL_STEP);
  const { status, setStatus } = useStatus();
  useEffect(() => {
    const fetchKey = async () => {
      try {
        setStatus({ loading: true, error: null });
        const rdata = await raxios.get(APIKEY_ENDPOINT);
        setApiKey(rdata.data.payload.apikey);
      } catch (err) {
        setStatus({
          ...status,
          error: "Could not fetch API key, please try again",
        });
      } finally {
        setStatus((old) => ({ ...old, loading: false }));
      }
    };
    if(!apiKey) {
      fetchKey();
    }
  }, []);
  const FORM_STEPS = useMemo(() => {
    return [
      {
        label: "Install ZeroK on your cluster",
        description: () => {
          return (
            <div className={cx(styles["step"], styles["step-1"])}>
              <p>
                Run the command below to install ZeroK in your current cluster
                context
              </p>
              {apiKey && (
                <CodeBlock
                  code={`zkctl install --apikey ${apiKey.key}`}
                  allowCopy
                />
              )}
            </div>
          );
        },
      },
      {
        label: "Activate ZeroK and perform a rolling restart",
        description: () => {
          return (
            <div className={cx(styles["step-2"])}>
              <p>
                Each namespace in the cluster has to be marked for ZeroK. Once
                marked, all the new pods will get activated for ZeroK. It can be
                done using the following command:
              </p>
              <CodeBlock code={`zkctl activate -n <namespace>`} allowCopy />
              <p>
                You have to restart the old pods. You can do both activation and
                restart using the following command:
              </p>
              <CodeBlock code={`zkctl activate -n <namespace> -r`} allowCopy />
            </div>
          );
        },
      },
    ];
  }, [apiKey]);

  return (
    <div className={styles["container"]}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {FORM_STEPS.map((step, index) => {
          return (
            <Step key={step.label}>
              <StepLabel>
                <h6 className={styles["step-label"]}>{step.label}</h6>
              </StepLabel>
              <StepContent>
                <div className={styles["step-content"]}>
                  {step.description()}
                  <div className={styles["step-buttons"]}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep((old) => old + 1)}
                    >
                      {index === FORM_STEPS.length - 1 ? "Finish" : "Next"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={() => setActiveStep((old) => old - 1)}
                      className={styles["step-back-btn"]}
                      color="secondary"
                    >
                      Go back
                    </Button>
                  </div>
                </div>
              </StepContent>
              
            </Step>
          );
        })}
      </Stepper>
      {activeStep === FORM_STEPS.length && <div className={styles['step-final']}>
                      <h6>You're all set! You should be able to see your cluster on the dashboard now.</h6>
                      </div>}
    </div>
  );
};

export default CreateClusterForm;
