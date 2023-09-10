import { Button, IconButton, Skeleton, Switch } from "@mui/material";
import { type ColumnSort, createColumnHelper } from "@tanstack/react-table";
import PageHeader from "components/helpers/PageHeader";
import TableFilter from "components/TableFilter";
import ChipX from "components/themeX/ChipX";
import DialogX from "components/themeX/DialogX";
import TableX from "components/themeX/TableX";
import TooltipX from "components/themeX/TooltipX";
import { useFetch } from "hooks/useFetch";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineTrash, HiWrenchScrewdriver } from "react-icons/hi2";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getRelativeTime } from "utils/dateHelpers";
import { CREATE_INTEGRATION_ENDPOINT } from "utils/integrations/endpoints";
import { type PrometheusListType } from "utils/integrations/types";
import raxios from "utils/raxios";

import styles from "./PrometheusTable.module.scss";
import { PROM_SORT_OPTIONS } from "./PrometheusTable.utils";

const DEFAULT_SORT = {
  id: PROM_SORT_OPTIONS[0].value.split(":")[0],
  desc: PROM_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const PrometheusTable = () => {
  const { data, fetchData, error } =
    useFetch<PrometheusListType[]>("integrations");
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  const [sortBy, setSortBy] = useState<ColumnSort[]>([DEFAULT_SORT]);
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: number;
    action: "disable" | "delete";
  } | null>(null);
  const router = useRouter();
  const { name } = router.query;

  const getData = () => {
    if (selectedCluster) {
      const endpoint = CREATE_INTEGRATION_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      );
      fetchData(endpoint);
    }
  };

  useEffect(() => {
    if (selectedCluster) {
      getData();
    }
    if (error) {
      setSelectedIntegration(null);
    }
  }, [selectedCluster, renderTrigger, error]);
  const helper = createColumnHelper<PrometheusListType>();
  const columns = [
    helper.accessor("url", {
      header: "Host",
      size: DEFAULT_COL_WIDTH * 4,
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return (
          <span className={styles["int-title"]}>
            {cell.getValue()}
            {cell.row.original.disabled && <ChipX label="Disabled" />}
          </span>
        );
      },
    }),
    helper.accessor("cluster_id", {
      header: "Cluster",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{cell.getValue()}</span>;
      },
    }),
    helper.accessor("level", {
      header: "Level",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <ChipX label={cell.getValue()} />;
      },
    }),
    helper.accessor("created_at", {
      header: "Created",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{getRelativeTime(cell.getValue())}</span>;
      },
    }),
    helper.accessor("updated_at", {
      header: "Updated",
      cell: (cell) => {
        if (cell.row.original.id === selectedIntegration?.id) {
          return <Skeleton variant="text" width={"100%"} />;
        }
        return <span>{getRelativeTime(cell.getValue())}</span>;
      },
    }),
    helper.display({
      header: "Actions",
      cell: (row) => {
        if (row.row.original.id === selectedIntegration?.id) {
          return <Skeleton width="100%" />;
        }
        return (
          <div className={styles.actions}>
            <TooltipX
              title={`${
                row.row.original.disabled ? "Enable" : "Disable"
              } Integration`}
            >
              <Switch
                checked={!row.row.original.disabled}
                size="small"
                className={styles["action-switch"]}
                onChange={(e, checked) => {
                  handleSwitch(row.row.original.id, checked);
                }}
              />
            </TooltipX>
            <TooltipX title="Edit integration">
              <Link
                href={`/integrations/${name as string}/edit?id=${
                  row.row.original.id
                }`}
              >
                <IconButton size="small">
                  <HiWrenchScrewdriver className={styles["action-icon"]} />
                </IconButton>
              </Link>
            </TooltipX>
            <TooltipX title="Delete integration">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedIntegration({
                    id: row.row.original.id,
                    action: "delete",
                  });
                }}
              >
                <HiOutlineTrash className={styles["action-icon"]} />
              </IconButton>
            </TooltipX>
          </div>
        );
      },
    }),
  ];
  const handleSwitch = async (id: number, enabled: boolean) => {
    setSelectedIntegration({
      id,
      action: "disable",
    });
    const integ = data!.find((i) => i.id === id);
    try {
      await raxios.post(
        CREATE_INTEGRATION_ENDPOINT.replace(
          "{cluster_id}",
          selectedCluster as string
        ),
        {
          ...integ,
          disabled: !enabled,
        }
      );
      getData();
    } catch (err) {
      console.log({ err });
    } finally {
      setSelectedIntegration(null);
    }
  };
  const handleDelete = async () => {
    if (!selectedIntegration || selectedIntegration.action !== "delete") return;
    const integ = data!.find((i) => i.id === selectedIntegration.id);
    try {
      await raxios.post(
        CREATE_INTEGRATION_ENDPOINT.replace(
          "{cluster_id}",
          selectedCluster as string
        ),
        {
          ...integ,
          deleted: true,
        }
      );
      getData();
    } catch (err) {
      console.log({ err });
    } finally {
      setSelectedIntegration(null);
    }
  };
  return (
    <div>
      <PageHeader
        title={"Prometheus integrations"}
        htmlTitle="Prometheus integrations"
        showRange={false}
        showRefresh={true}
        showBreadcrumb={true}
        leftExtras={[
          <TableFilter
            sortBy={sortBy[0]}
            key="table-sort"
            onChange={(val) => {
              setSortBy([val]);
            }}
            options={PROM_SORT_OPTIONS}
          />,
        ]}
        rightExtras={[
          <Button
            key="add-btn"
            variant="contained"
            className={styles["add-btn"]}
            onClick={() => {
              router.push(`/integrations/${name as string}/create`);
            }}
          >
            <HiOutlinePlus /> Add data source
          </Button>,
        ]}
      />
      {selectedIntegration?.action === "delete" && (
        <DialogX
          isOpen={
            !!selectedIntegration && selectedIntegration.action === "delete"
          }
          title="Delete Probe"
          successText="Delete"
          cancelText="Cancel"
          onClose={() => {
            setSelectedIntegration(null);
          }}
          onSuccess={handleDelete}
          onCancel={() => {
            setSelectedIntegration(null);
          }}
        >
          <span>Are you sure you want to delete this integration?</span> <br />
          <em>This action cannot be undone.</em>
        </DialogX>
      )}
      <div className={styles.table}>
        <TableX
          columns={columns}
          data={data ?? null}
          sortBy={sortBy}
          onSortingChange={setSortBy}
        />
      </div>
      <div className={styles.pagination}>
        {/* <PaginationX itemsPerPage={INTEGRATIONS_PAGE_SIZE} totalItems={25} /> */}
      </div>
    </div>
  );
};

export default PrometheusTable;
