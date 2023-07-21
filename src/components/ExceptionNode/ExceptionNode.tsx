import { nanoid } from "nanoid";
import { Handle, Position } from "reactflow";
import { type GenericObject } from "utils/types";

import styles from "./ExceptionNode.module.scss";

interface ExceptionNodeProps {
  data: GenericObject;
  label: string;
}

const ExceptionNode = ({ data }: ExceptionNodeProps) => {
  return (
    <div className={styles.container}>
      <Handle type="target" position={Position.Left} />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} id={nanoid()} />
    </div>
  );
};

export default ExceptionNode;
