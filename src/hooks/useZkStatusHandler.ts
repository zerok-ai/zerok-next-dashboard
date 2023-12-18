import { useEffect } from "react";
import { dispatchSnackbar } from "utils/generic/functions";

interface UseSnackBarProps {
  success?: {
    message: string;
    open: boolean;
    callback?: () => void;
  };
  error?: {
    message: string;
    open: boolean;
    callback?: () => void;
  };
}
const useZkStatusHandler = ({ success, error }: UseSnackBarProps) => {
  useEffect(() => {
    if (success?.open) {
      dispatchSnackbar("success", success.message);
    }
    if (error?.open) {
      dispatchSnackbar("error", error.message);
    }
  }, [success?.open, error?.open]);
  return null;
};

export default useZkStatusHandler;
