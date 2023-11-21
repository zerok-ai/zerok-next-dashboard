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
    dataprivacy: {
      obfuscation: {
        enabled: false,
        value: "obfuscation",
        disabledText:
          "This feature has been disabled for your organisation, please contact ZeroK support for more information.",
      },
    },
  },
};

export const DEFAULT_FLAGSMITH_ID = "RQR3vnXBgyp7Warwpm4xrg";
