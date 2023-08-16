import { zodResolver } from "@hookform/resolvers/zod";
import cx from "classnames";
import TagX from "components/themeX/TagX";
import React from "react";
import { useForm } from "react-hook-form";
import { HiOutlineMail } from "react-icons/hi";
import z from "zod";

import styles from "../ProbeCreateForm.module.scss";

interface EmailInputProps {
  emails: string[];
  addEmail: (email: string) => void;
  deleteEmail: (email: string) => void;
}

const EmailSchema = z.object({
  email: z.string().min(1).email(),
});

type EmailSchemaType = z.infer<typeof EmailSchema>;

const EmailInput = ({ emails, addEmail, deleteEmail }: EmailInputProps) => {
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = (data: EmailSchemaType) => {
    addEmail(data.email);
    reset();
    setFocus("email");
  };

  const removeEmail = (email: string) => {
    deleteEmail(email);
    setFocus("email");
  };
  console.log({ errors });

  return (
    <div className={styles["email-container"]}>
      <label htmlFor="email">
        <HiOutlineMail className={styles["email-icon"]} /> Email Recipients
      </label>
      <div className={styles["email-input-container"]}>
        <div className={styles["emails-container"]}>
          {emails.map((email, index) => {
            return (
              <TagX
                key={index}
                label={email}
                closable={true}
                onClose={removeEmail}
              />
            );
          })}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            id="email"
            {...register("email")}
            className={cx(errors.email && styles["error-text"])}
          />
        </form>
      </div>
    </div>
  );
};

export default EmailInput;
