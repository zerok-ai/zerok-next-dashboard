import { ConfigContext } from "contexts/ConfigContext";
import { useContext } from "react";

// ==============================|| CONFIG - HOOKS  ||============================== //

const useConfig = () => useContext(ConfigContext);

export default useConfig;
