import { IconButton } from "@mui/material";
import styles from "./CodeBlock.module.scss";
import { BsFillClipboardFill } from "react-icons/bs";
import CopyToClipboard from "react-copy-to-clipboard";

interface CodeBlockProps {
  code: string;
  allowCopy: boolean;
}

const CodeBlock = ({ code, allowCopy }: CodeBlockProps) => {
  console.log({ code });
  return (
    <div className={styles["container"]}>
      <pre>
        <code>
          <span className={styles["code"]}>{code}</span>
          <span className={styles["copy"]}>
            <CopyToClipboard text={code}>
              <IconButton size="small">
                <BsFillClipboardFill />
              </IconButton>
            </CopyToClipboard>
          </span>
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
