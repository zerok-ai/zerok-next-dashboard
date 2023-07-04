import styles from "./ClusterCreateModal.module.scss";
import CreateClusterForm from "components/CreateClusterForm";
import ModalX from "components/themeX/ModalX";

interface ClusterCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClusterCreateModal = ({ isOpen, onClose }: ClusterCreateModalProps) => {
  if (!isOpen) {
    return null;
  }
  return (
    <ModalX
      isOpen={isOpen}
      onClose={onClose}
      keepMounted={true}
      title="Create a new cluster"
    >
      {" "}
      <CreateClusterForm />
    </ModalX>
  );
};

export default ClusterCreateModal;
