import { nanoid } from "nanoid";
import { useState } from "react";

export const useTrigger = () => {
  const [trigger, setTrigger] = useState(nanoid());
  const changeTrigger = () => {
    setTrigger(nanoid());
  };
  return { trigger, changeTrigger };
};
