import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import cx from "classnames";
import TextFormField from "components/forms/TextFormField";
import Link from "next/link";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FORGOT_PASSWORD_ENDPOINT } from "utils/endpoints";
import raxios from "utils/raxios";
import { z } from "zod";

import styles from "./ForgotPasswordForm.module.scss";

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
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<null | string>(null);

  const onSubmit: SubmitHandler<ForgotPasswordSchemaType> = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await raxios.post(
        FORGOT_PASSWORD_ENDPOINT.replace("{email}", values.email)
      );
    } catch (err) {
      setError(
        "Could not send recovery email, please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={cx("form", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          loading={loading}
        >
          Send recovery email
        </LoadingButton>
        {error && <p className="error-text">{error}</p>}
      </form>
      {/* Login link */}
      <Link href="/login" className={"form-end-link"}>
        Login
      </Link>
    </div>
  );
};

export default ForgotPasswordForm;
