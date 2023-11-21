import { Button } from "@mui/material";
import { type NextRouter } from "next/router";
import { useDispatch } from "redux/store";
import { postNewChatEvent } from "redux/thunks/chat";
import { CHAT_EVENTS } from "utils/gpt/constants";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./SynthesizeIncidentButton.module.scss";

interface SynthesizeIncidentButtonProps {
  incidentId: string;
  selectedCluster: string;
  router: NextRouter;
  issueId: string;
  isChatEnabled: boolean;
}

const SynthesizeIncidentButton = ({
  incidentId,
  selectedCluster,
  isChatEnabled,
  router,
  issueId,
}: SynthesizeIncidentButtonProps) => {
  if (!isChatEnabled) return null;
  const dispatch = useDispatch();
  return (
    <Button
      variant="contained"
      size="extraSmall"
      className={styles["synth-btn"]}
      onClick={() => {
        dispatch(
          postNewChatEvent({
            incidentId: (router.query.latest as string) ?? incidentId,
            issueId,
            selectedCluster,
            type: CHAT_EVENTS.INFERENCE,
          })
        );
      }}
    >
      Synthesis request <img src={`${ICON_BASE_PATH}/${ICONS["ai-magic"]}`} />
    </Button>
  );
};

export default SynthesizeIncidentButton;
