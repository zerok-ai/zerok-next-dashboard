import { IconButton, Modal } from "@mui/material";
import styles from "./ClusterCreateModal.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import CreateClusterForm from "components/CreateClusterForm";

interface ClusterCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClusterCreateModal = ({ isOpen, onClose }: ClusterCreateModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={styles["modal"]}
      keepMounted
    >
      <div className={styles["container"]}>
        <div className={styles["modal-header"]}>
          <h5>Create a new cluster</h5>
          <IconButton className={styles["modal-close-icon"]} onClick={onClose}>
            <AiOutlineClose />
          </IconButton>
        </div>
        <div className={styles["modal-content"]}>
          <CreateClusterForm />
        </div>
      </div>
    </Modal>
  );
};

export default ClusterCreateModal;
