import { nanoid } from "nanoid";
import { Handle, type NodeProps, Position } from "reactflow";

import styles from "./SelectedNode.module.scss";

const SelectedNode = ({ data }: NodeProps) => {
  return (
    <div className={styles.container}>
      <Handle type="target" position={Position.Left} />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} id={nanoid()} />
    </div>
  );
};

export default SelectedNode;
