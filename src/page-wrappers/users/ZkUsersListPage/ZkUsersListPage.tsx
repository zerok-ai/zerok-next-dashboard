import AddNewBtn from "components/helpers/AddNewBtn";
import PageHeader from "components/helpers/PageHeader";
import ZkTabs from "components/ZkTabs";
import ZkUserInviteModal from "components/ZkUserInviteModal";
import ZkUsersListTable from "components/ZkUsersListTable";
import { useToggle } from "hooks/useToggle";
import { useMemo, useState } from "react";
const TABS = [
  {
    label: "Members",
    value: "members",
  },
  {
    label: "Invitations",
    value: "invitations",
  },
];

const ZkUsersListPage = () => {
  const [selectedTab, setSelectedTab] = useState(TABS[0].value);
  const [isInviteModalOpen, toggleInviteModal] = useToggle(false);
  const inviteButton = useMemo(() => {
    return (
      <AddNewBtn
        onClick={toggleInviteModal}
        text="Invite user"
        key={"new-user"}
      />
    );
  }, []);
  return (
    <div>
      <PageHeader
        title="Users"
        htmlTitle="Users"
        showRange={false}
        showRefresh={false}
        rightExtras={[inviteButton]}
        showClusterSelector={false}
      />
      <ZkTabs
        tabs={TABS}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === "members" && <ZkUsersListTable />}
      {isInviteModalOpen && <ZkUserInviteModal onClose={toggleInviteModal} />}
    </div>
  );
};

export default ZkUsersListPage;
