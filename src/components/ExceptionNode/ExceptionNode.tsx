import { nanoid } from "nanoid";
import { Handle, type NodeProps, Position } from "reactflow";

import styles from "./ExceptionNode.module.scss";

const ExceptionNode = ({ data }: NodeProps) => {
  return (
    <div className={styles.container}>
      <Handle type="target" position={Position.Left} />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} id={nanoid()} />
    </div>
  );
};

export default ExceptionNode;
