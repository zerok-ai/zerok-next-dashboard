import { LoadingButton } from "@mui/lab";
import useStatus from "hooks/useStatus";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { dispatchSnackbar } from "utils/generic/functions";
import { TEST_UNSAVED_PROM_CONNECTION_ENDPOINT } from "utils/integrations/endpoints";
import raxios from "utils/raxios";

import { type PromFormSchemaType } from "../../PrometheusForm.utils";

interface PromTestButtonProps {
  form: PromFormSchemaType;
  disabled: boolean;
}

const PromTestButton = ({ form, disabled }: PromTestButtonProps) => {
  const { status, setStatus } = useStatus();
  const { name, url, username, password, level } = form;
  const { selectedCluster } = useSelector(clusterSelector);
  const testConnection = async () => {
    setStatus({
      loading: true,
      error: null,
    });
    try {
      const body = {
        type: "prometheus",
        alias: name,
        url,
        authentication: {
          username,
          password,
        },
        level,
      };
      const endpoint = TEST_UNSAVED_PROM_CONNECTION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster!
      );
      await raxios.post(endpoint, body);
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
