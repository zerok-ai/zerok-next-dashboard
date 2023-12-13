import CodeBlock from "components/helpers/CodeBlock";
import VisibilityToggleButton from "components/helpers/VisibilityToggleButton";
import { useLazyGetApiKeyQuery } from "fetchers/user/apiKeysSlice";
import { useEffect, useState } from "react";
import { dispatchSnackbar } from "utils/generic/functions";

import styles from "./ApiKeyCode.module.scss";

interface ApiKeyCodeProps {
  code: string;
}

const ApiKeyCode = ({ code }: ApiKeyCodeProps) => {
  const [visible, setVisible] = useState(false);
  const [getApiKey, { data: apiKey, isError }] = useLazyGetApiKeyQuery();
  useEffect(() => {
    if (visible && !apiKey) {
      getApiKey(code);
    }
  }, [visible]);

  useEffect(() => {
    if (isError) {
      dispatchSnackbar("error", "Could not fetch API key");
    }
  }, [isError]);

  return (
    <div className={styles.container}>
      <CodeBlock
        code={visible && apiKey?.key ? apiKey.key : "*".repeat(16)}
        allowCopy={false}
        // code={key && visible ? key : "*".repeat(16)}
        // copyText={key as string}
        color="light"
      />
      <VisibilityToggleButton
        isVisibleDefault={visible}
        name="toggle API key visibility"
        customClassName={styles["visibility-toggle"]}
        onChange={() => {
          setVisible(!visible);
        }}
      />
    </div>
  );
};

export default ApiKeyCode;
