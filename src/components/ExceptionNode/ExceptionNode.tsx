import { nanoid } from "nanoid";
import { Handle, type NodeProps, Position } from "reactflow";
import cx from "classnames";

import styles from "./ExceptionNode.module.scss";

interface ExceptionNodeProps extends NodeProps {
  selectedSpan: string;
}

const ExceptionNode = ({ data, selectedSpan }: ExceptionNodeProps) => {
  return (
    <div
      className={cx(
        styles.container,
        selectedSpan === data.span_id && styles.selected
      )}
    >
      <Handle type="target" position={Position.Left} />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} id={nanoid()} />
    </div>
  );
};

export default ExceptionNode;
