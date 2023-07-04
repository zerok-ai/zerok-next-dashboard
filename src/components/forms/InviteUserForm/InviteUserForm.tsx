import { useForm } from "react-hook-form";
import styles from "./InviteUserForm.module.scss";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFormField from "../TextFormField";
import { Button } from "@mui/material";
import useStatus from "hooks/useStatus";
import raxios from "utils/raxios";
import { GET_USERS_ENDPOINT, INVITE_USER_ENDPOINT } from "utils/endpoints";
import { useStatusType } from "utils/types";
import { LoadingButton } from "@mui/lab";

interface InviteUserFormProps {
  onFinish: () => void;
}

const formKeys = ["firstName", "lastName", "email"] as const;

const InviteUserFormSchema = z.object({
  email: z.string().email().min(1),
  firstName: z.string().min(1, "First name cannot be blank"),
  lastName: z.string().min(1, "Last name cannot be blank"),
});

type InviteUserFormSchemaType = z.infer<typeof InviteUserFormSchema>;

const FORM_ITEMS: { name: (typeof formKeys)[number]; label: string }[] = [
  {
    name: "firstName",
    label: "First Name",
  },
  {
    name: "lastName",
    label: "Last Name",
  },
  {
    name: "email",
    label: "Email",
  },
];

const InviteUserForm = ({ onFinish }: InviteUserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteUserFormSchemaType>({
    resolver: zodResolver(InviteUserFormSchema),
  });
  const { status, setStatus } = useStatus();
  const onSubmit = async (values: InviteUserFormSchemaType) => {
    try {
      setStatus({ loading: true, error: null });
      await raxios.post(INVITE_USER_ENDPOINT, {
        name: values.firstName,
        familyName: values.lastName,
        email: values.email,
      });
      onFinish();
    } catch (error) {
      setStatus({
        loading: false,
        error: "Could not invite user, please try again",
      });
    } finally {
      setStatus((old) => ({ ...old, loading: false }));
    }
  };
  return (
    <form className={"form"} onSubmit={handleSubmit(onSubmit)}>
      {FORM_ITEMS.map((item) => {
        return (
          <TextFormField
            key={item.name}
            name={item.name}
            label={item.label}
            errorText={errors[item.name]?.message}
            register={register}
            placeholder={`Enter ${item.label}`}
            error={!!errors[item.name]}
            customClassName="form-item"
            type="text"
          />
        );
      })}
      <LoadingButton variant="contained" type="submit" loading={status.loading}>
        Send invite
      </LoadingButton>
    </form>
  );
};

export default InviteUserForm;
