import CreateClusterForm from "components/forms/CreateClusterForm";
import ModalX from "components/themeX/ModalX";
import { closeClusterModal, clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";

const ClusterCreateModal = () => {
  const { isClusterModalOpen } = useSelector(clusterSelector);
  const dispatch = useDispatch();
  if (!isClusterModalOpen) {
    return null;
  }

  return (
    <ModalX
      isOpen={isClusterModalOpen}
      onClose={() => {
        dispatch(closeClusterModal());
      }}
      keepMounted={true}
      title="Install ZeroK on your cluster"
    >
      {" "}
      <CreateClusterForm />
    </ModalX>
  );
};

export default ClusterCreateModal;
