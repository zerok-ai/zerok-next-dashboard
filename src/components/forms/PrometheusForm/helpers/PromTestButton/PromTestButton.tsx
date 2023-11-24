import { LoadingButton } from "@mui/lab";
import useStatus from "hooks/useStatus";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { dispatchSnackbar } from "utils/generic/functions";
import { type APIResponse } from "utils/generic/types";
import { TEST_UNSAVED_PROM_CONNECTION_ENDPOINT } from "utils/integrations/endpoints";
import { type IntegrationStatusResponseType } from "utils/integrations/types";
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
      const rdata = await raxios.post<
        APIResponse<IntegrationStatusResponseType>
      >(endpoint, body);
      const isSuccess =
        rdata.data.payload.integration_status.connection_status === "success";
      dispatchSnackbar(
        isSuccess ? "success" : "error",
        isSuccess ? "Connection successful" : "Connection failed"
      );
    } catch (err) {
      dispatchSnackbar("error", "Connection test failed.");
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
