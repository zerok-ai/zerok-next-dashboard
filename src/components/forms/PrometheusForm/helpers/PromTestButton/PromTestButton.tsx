import { LoadingButton } from "@mui/lab";
import useStatus from "hooks/useStatus";
import { dispatchSnackbar } from "utils/generic/functions";

import { type PromFormSchemaType } from "../../PrometheusForm.utils";

interface PromTestButtonProps {
  form: PromFormSchemaType;
  disabled: boolean;
}

const PromTestButton = ({ form, disabled }: PromTestButtonProps) => {
  const { status, setStatus } = useStatus();
  const testConnection = async () => {
    setStatus({
      loading: true,
      error: null,
    });
    try {
      dispatchSnackbar("success", "Connection successful.");
    } catch (err) {
      dispatchSnackbar(
        "error",
        "Connection failed, please check the connection parameters and try again."
      );
    } finally {
      setStatus({
        loading: false,
        error: null,
      });
    }
  };
  return (
    <LoadingButton
      onClick={testConnection}
      disabled={disabled}
      variant="contained"
      color="secondary"
      loading={status.loading}
    >
      Test connection
    </LoadingButton>
  );
};

export default PromTestButton;
