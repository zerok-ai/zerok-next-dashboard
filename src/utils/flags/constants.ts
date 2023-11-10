import { type ZkAllFlagsType } from "./types";

export const ZK_DEFAULT_ALL_FLAGS: ZkAllFlagsType = {
  default: {
    gpt: {
      zkchat: {
        enabled: false,
        value: "zkchat",
        disabledText:
          "This feature has been disabled for your organisation, please contact ZeroK support for more information.",
      },
    },
    servicepage: {
      showservicepage: {
        enabled: false,
        value: "showservicepage",
        disabledText:
          "This feature has been disabled for your organisation, please contact ZeroK support for more information.",
      },
    },
  },
};