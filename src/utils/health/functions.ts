import { ServiceMapDetail } from "./types";

export const filterEmptyServiceMapNodes = (smap: ServiceMapDetail[]) => {
  return smap.filter((node) => {
    return (
      node.responder_service !== "" &&
      node.requestor_service !== "" &&
      node.responder_pod !== "" &&
      node.requestor_pod !== "" &&
      node.responder_ip !== "" &&
      node.requestor_ip !== ""
    );
  });
};
