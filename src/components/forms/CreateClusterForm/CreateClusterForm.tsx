import { Button, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import cx from "classnames";
import CustomSkeleton from "components/custom/CustomSkeleton";
import CodeBlock from "components/helpers/CodeBlock";
import ModalX from "components/themeX/ModalX";
import { useLazyGetTopApiKeyQuery } from "fetchers/user/apiKeysSlice";
import { useEffect, useMemo, useState } from "react";
import { closeClusterModal, clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
import { dispatchSnackbar } from "utils/generic/functions";

import styles from "./CreateClusterForm.module.scss";

const INSTALL_STEP = 1;

const CreateClusterForm = () => {
  const [getTopkey, { data: apiKey, isError }] = useLazyGetTopApiKeyQuery();
  const [activeStep, setActiveStep] = useState(INSTALL_STEP);
  const { isClusterModalOpen } = useSelector(clusterSelector);
  const dispatch = useDispatch();

  const FORM_STEPS: Array<{
    label: string;
    description: () => JSX.Element;
  }> = useMemo(() => {
    return [
      {
        label: "Install ZeroK CLI (zkctl)",
        description: () => {
          return (
            <div className={cx(styles["step-2"])}>
              <p>Install / update zkctl by running the following command:</p>
              <CodeBlock
                code={`bash -c "$(curl -fsSL https://dl.zerok.ai/cli/install.sh)"`}
                allowCopy
              />
            </div>
          );
        },
      },
      {
        label: "Install ZeroK on your cluster",
        description: () => {
          return (
            <div className={cx(styles.step, styles["step-1"])}>
              <p>
                Run the command below to install ZeroK in your current cluster
                context
              </p>
              {apiKey ? (
                <CodeBlock
                  code={`zkctl install --apikey ${apiKey.key as string}`}
                  allowCopy
                />
              ) : (
                <CustomSkeleton len={1} />
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

  useEffect(() => {
    if (isClusterModalOpen && !apiKey) {
      getTopkey();
    }
  }, [isClusterModalOpen]);
  useEffect(() => {
    if (isError) {
      dispatchSnackbar("error", "Could not fetch API key");
    }
  }, [isError]);
  if (!isClusterModalOpen) {
    return null;
  }

  return (
    <ModalX
      isOpen={isClusterModalOpen}
      onClose={() => {
        dispatch(closeClusterModal());
      }}
      keepMounted={true}
      title="Install ZeroK on your cluster"
    >
      <div className={styles.container}>
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
                        onClick={() => {
                          setActiveStep((old) => old + 1);
                        }}
                      >
                        {index === FORM_STEPS.length - 1 ? "Finish" : "Next"}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => {
                          setActiveStep((old) => old - 1);
                        }}
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
        {activeStep === FORM_STEPS.length && (
          <div className={styles["step-final"]}>
            <h6>
              You&apos;re all set! You should be able to see your cluster on the
              dashboard now.
            </h6>
          </div>
        )}
      </div>
    </ModalX>
  );
};

export default CreateClusterForm;
