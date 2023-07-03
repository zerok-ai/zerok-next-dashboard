import { IconButton } from "@mui/material";
import styles from "./CodeBlock.module.scss";
import { BsFillClipboardFill } from "react-icons/bs";
import CopyToClipboard from "react-copy-to-clipboard";

import cx from "classnames";

interface CodeBlockProps {
  code: string;
  allowCopy: boolean;
  copyText?:string;
  color?:'dark' | 'light';
}

const CodeBlock = ({ code, allowCopy, copyText, color = 'dark' }: CodeBlockProps) => {
  return (
    <div className={cx(styles["container"],styles[color])}>
      <pre>
        <code>
          <span className={styles["code"]}>{code}</span>
          <span className={styles["copy"]}>
            {allowCopy && <CopyToClipboard text={copyText || code}>
              <IconButton size="small">
                <BsFillClipboardFill />
              </IconButton>
            </CopyToClipboard>}
          </span>
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
