import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import cx from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./ForgotPasswordForm.module.scss";
import TextFormField from "components/forms/TextFormField";
import { Button } from "@mui/material";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const ForgotPasswordSchema = z.object({
    email: z.string().email().min(1, "Email cannot be empty"),
  });
  type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit:SubmitHandler<ForgotPasswordSchemaType> = (values) => {
    
  };

  return (
    <div className={styles["container"]}>
      <form className={cx("form", styles["form"])} onSubmit={handleSubmit(onSubmit)}>
        {/* Email field */}
        <TextFormField
          name="email"
          placeholder="Your ZeroK email"
          label="Enter your email"
          register={register}
          customClassName={styles["form-field"]}
          error={!!errors.email}
          errorText={errors.email?.message}
        />
        {/* Submit button */}
        <Button variant="contained" color="primary" type="submit">
          Reset password
        </Button>
      </form>
      {/* Login link */}
      <Link href="/login" className={"form-end-link"}>
        Login
      </Link>
    </div>
  );
};

export default ForgotPasswordForm;
