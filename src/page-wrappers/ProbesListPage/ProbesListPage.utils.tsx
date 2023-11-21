import { createColumnHelper } from "@tanstack/react-table";
import cx from "classnames";
import EnableDisableTableAction from "components/EnableDisableTableAction";
import TableActions from "components/helpers/TableActions";
import ChipX from "components/themeX/ChipX";
import TooltipX from "components/themeX/TooltipX";
import ZkLink from "components/themeX/ZkLink";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import {
  getFormattedTimeFromEpoc,
  getRelativeTimeFromEpoc,
} from "utils/dateHelpers";
import { trimString } from "utils/functions";
import { getServiceListFromScenario } from "utils/probes/functions";
import { type ScenarioDetailType } from "utils/scenarios/types";
import { type TableActionItem } from "utils/tables/types";

import styles from "./ProbesListPage.module.scss";

const helper = createColumnHelper<ScenarioDetailType>();

interface ProbeListColumnArgs {
  selectedProbe: string | null;
  onUpdateProbeStatus: (data: ScenarioDetailType) => void;
  onDeleteProbe: (probe: string) => void;
}
export const probeListColumns = ({
  selectedProbe,
  onUpdateProbeStatus,
  onDeleteProbe,
}: ProbeListColumnArgs) => {
  return [
    helper.accessor("scenario.scenario_title", {
      header: "Name",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (info) => {
        const row = info.row.original;
        const {
          scenario: { scenario_id, scenario_type },
        } = row;
        const isDisabled = !!row.disabled_at;
        return (
          <div
            className={cx(
              styles["scenario-title-container"],
              isDisabled && styles.disabled
            )}
          >
            <div className={styles["scenario-title"]}>
              <ZkLink href={`/probes/view?id=${scenario_id}`}>
                {info.getValue()}
              </ZkLink>
              {isDisabled && (
                <ChipX label="Disabled" upperCase={true} color="disabled" />
              )}
            </div>
            {scenario_type === "SYSTEM" && (
              <ChipX label="System" upperCase={false} />
            )}
          </div>
        );
      },
    }),
    helper.display({
      id: "created_by",
      header: "Created by",
      size: DEFAULT_COL_WIDTH / 2,
      cell: () => {
        return (
          <div className={styles.source}>
            <img src={`/images/brand/zerok_source_logo.png`} alt="zerok_logo" />
            <span>ZeroK</span>
          </div>
        );
      },
    }),
    helper.accessor("created_at", {
      header: "Created at",
      size: DEFAULT_COL_WIDTH * 1,
      cell: (info) => {
        return (
          <TooltipX title={getFormattedTimeFromEpoc(info.getValue()) as string}>
            <span>{getRelativeTimeFromEpoc(info.getValue())}</span>
          </TooltipX>
        );
      },
    }),
    helper.display({
      id: "services",
      header: "Impacted services",
      size: DEFAULT_COL_WIDTH * 2,
      cell: (info) => {
        const services = getServiceListFromScenario(
          info.row.original.scenario
        ).join(", ");
        return (
          <TooltipX title={services} disabled={services.length < 50}>
            <span>{trimString(services, 50)}</span>
          </TooltipX>
        );
      },
    }),
    helper.display({
      id: "actions",
      size: DEFAULT_COL_WIDTH / 4,
      cell: (info) => {
        const isEnabled = !info.row.original.disabled_at;
        const row = info.row.original;
        if (row.scenario.scenario_type === "SYSTEM") return null;
        const actions: TableActionItem[] = [
          {
            element: <EnableDisableTableAction isEnabled={isEnabled} />,
            onClick: () => {
              onUpdateProbeStatus(row);
            },
          },
          {
            element: <span>Delete</span>,
            onClick: () => {
              onDeleteProbe(row.scenario.scenario_id);
            },
          },
        ];
        const isLoading = selectedProbe === row.scenario.scenario_id;
        return <TableActions list={actions} loading={isLoading} />;
      },
    }),
  ];
};
