import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import TextFormField from "components/forms/TextFormField";
import ModalX from "components/themeX/ModalX";
import useStatus from "hooks/useStatus";
import { useForm } from "react-hook-form";
import { dispatchSnackbar } from "utils/generic/functions";
import { z } from "zod";

import styles from "./ZkUserInviteModal.module.scss";

interface ZkUserInviteModalProps {
  onClose: () => void;
}
const ZkUserInviteSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email cannot be empty"),
});
type ZkUserInviteSchemaType = z.infer<typeof ZkUserInviteSchema>;

const USER_INVITE_TYPE = "basic_member";

const ZkUserInviteModal = ({ onClose }: ZkUserInviteModalProps) => {
  const { organization } = useOrganization();
  const { status, setStatus } = useStatus();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZkUserInviteSchemaType>({
    resolver: zodResolver(ZkUserInviteSchema),
  });
  console.log({ errors });
  const onSubmit = async (values: ZkUserInviteSchemaType) => {
    setStatus({ loading: true, error: null });
    try {
      await organization?.inviteMember({
        emailAddress: values.email,
        role: USER_INVITE_TYPE,
      });
      dispatchSnackbar("success", "Invited user successfully");
      setStatus({ loading: false, error: null });
      onClose();
    } catch (err) {
      setStatus({
        loading: false,
        error: "Could not send invite, please try again",
      });
    }
  };
  return (
    <ModalX isOpen={true} onClose={onClose} title="Invite a new user">
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={styles.field}>
          <TextFormField
            name="email"
            placeholder="User's email"
            label="Email"
            register={register}
            error={!!errors.email}
            errorText={errors.email?.message}
            autoComplete="on"
          />
        </fieldset>
        {status.error && <p className={styles.error}>{status.error}</p>}
        <LoadingButton
          color="primary"
          variant="contained"
          type="submit"
          loading={status.loading}
        >
          Invite
        </LoadingButton>
      </form>
    </ModalX>
  );
};

export default ZkUserInviteModal;
