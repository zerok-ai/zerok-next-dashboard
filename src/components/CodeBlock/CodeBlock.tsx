import { IconButton } from "@mui/material";
import cx from "classnames";
import CopyToClipboard from "react-copy-to-clipboard";
import { BsFillClipboardFill } from "react-icons/bs";

import styles from "./CodeBlock.module.scss";

interface CodeBlockProps {
  code: string;
  allowCopy: boolean;
  copyText?: string;
  color?: "dark" | "light";
}

const CodeBlock = ({
  code,
  allowCopy,
  copyText,
  color = "dark",
}: CodeBlockProps) => {
  return (
    <div className={cx(styles.container, styles[color])}>
      <pre>
        <code>
          <span className={styles.code}>{code}</span>
          <span className={styles.copy}>
            {allowCopy && (
              <CopyToClipboard text={copyText ?? code}>
                <IconButton size="small">
                  <BsFillClipboardFill />
                </IconButton>
              </CopyToClipboard>
            )}
          </span>
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
