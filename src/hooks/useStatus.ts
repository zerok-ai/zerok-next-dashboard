import { useState } from "react";
import { useStatusType } from "utils/types";

const useStatus = () => {
  // @TODO - make this a useFetch
  const [status, setStatus] = useState<useStatusType>({
    loading: false,
    error: null,
  });

  return { status, setStatus };
};

export default useStatus;
