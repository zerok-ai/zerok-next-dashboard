import { useFlagsmith } from "flagsmith/react";
import { useSelector } from "redux/store";
import {
  type ZkFlagConfigType,
  type ZkFlagFeatureType,
} from "utils/flags/types";

export const useZkFlag = <
  U extends ZkFlagFeatureType,
  T extends keyof ZkFlagConfigType[U]
>(
  flagName: T,
  level: "org" | "cluster",
  feature: U
) => {
  const flagsmith = useFlagsmith();
  const allFlags = flagsmith.getAllFlags();
  const { user } = useSelector((state) => state.auth);
  const { selectedCluster } = useSelector((state) => state.cluster);
  if (!user || !user.org_id || (level === "cluster" && !selectedCluster)) {
    return null;
  }

  const accessor = level === "org" ? user.org_id : (selectedCluster as string);
  const configFlag = allFlags[accessor];
  if (configFlag.enabled) {
    const config = flagsmith.getValue<ZkFlagConfigType>(accessor, {
      json: true,
    });
    // const featureConfig = config[feature];
    // const flag = featureConfig[flagName];
    return config;
  }
};
