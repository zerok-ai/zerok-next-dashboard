import { useFlagsmith } from "flagsmith/react";
import { useSelector } from "redux/store";
import { ZK_DEFAULT_ALL_FLAGS } from "utils/flags/constants";
import {
  type ZkFlagConfigType,
  type ZkFlagFeatureType,
} from "utils/flags/types";

export const useZkFlag = <
  U extends ZkFlagFeatureType,
  T extends keyof ZkFlagConfigType[U]
>(
  level: "org" | "cluster",
  feature: U,
  flagName: T
) => {
  const flagsmith = useFlagsmith();
  const allFlags = flagsmith.getAllFlags();
  const { user } = useSelector((state) => state.auth);
  const { selectedCluster } = useSelector((state) => state.cluster);
  if (!user || !user.org_name || (level === "cluster" && !selectedCluster)) {
    return ZK_DEFAULT_ALL_FLAGS.default[feature][flagName];
  }
  const accessor =
    level === "org" ? user.org_name : (selectedCluster as string);
  const configFlag = allFlags[accessor];
  if (configFlag && configFlag.enabled) {
    const config = flagsmith.getValue<ZkFlagConfigType>(accessor, {
      json: true,
    });
    const featureConfig = config[feature];
    const flag = featureConfig[flagName];
    return flag;
  } else {
    return ZK_DEFAULT_ALL_FLAGS.default[feature][flagName];
  }
};
