import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import cx from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./ResetPasswordForm.module.scss";
import TextFormField from "components/forms/TextFormField";
import { Button, InputAdornment } from "@mui/material";
import Link from "next/link";
import VisibilityToggleButton from "components/VisibilityToggleButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useStatus from "hooks/useStatus";
import { SET_USER_PASSWORD_ENDPOINT } from "utils/endpoints";
import { maskPassword } from "utils/functions";
import raxios from "utils/raxios";
import { LoadingButton } from "@mui/lab";

const ResetPasswordForm = () => {
  const ResetPasswordSchema = z.object({
    password: z
      .string()
      .min(1, "Password cannot be empty")
      .min(4, "Password must be at least 5 characters long"),
  });
  type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const router = useRouter();

  const { query } = router;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { status, setStatus } = useStatus();

  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = async (values) => {
    const { token, flow } = query;
    const { password } = values;
    try {
      setStatus({ loading: true, error: null });
      await raxios.post(SET_USER_PASSWORD_ENDPOINT, {
        token,
        flow,
        password: maskPassword(password),
      });
      router.push("/login");
    } catch (err) {
      setStatus({
        loading: false,
        error: "Could not reset password please try again",
      });
    } finally {
      setStatus((old) => ({ ...old, loading: false }));
    }
  };

  useEffect(() => {
    if (router.isReady && (!query.token || !query.flow)) {
      router.push("/login");
    }
  }, [router, query]);

  return (
    <div className={styles["container"]}>
      <form
        className={cx("form", styles["form"])}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Password field */}
        <TextFormField
          name="password"
          placeholder="New password"
          label="Enter your password"
          register={register}
          type={isPasswordVisible ? "text" : "password"}
          customClassName={styles["form-field"]}
          error={!!errors.password}
          errorText={errors.password?.message}
          endAdornment={
            <InputAdornment position="end">
              <VisibilityToggleButton
                name="password"
                isVisibleDefault={isPasswordVisible}
                onChange={(val) => setIsPasswordVisible(val)}
                customClassName={styles["remove-icon-styles"]}
              />
            </InputAdornment>
          }
        />
        {/* Submit button */}
        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          loading={status.loading}
        >
          Reset password
        </LoadingButton>
      </form>
      {status.error && <p className="form-error">{status.error}</p>}
      {/* Login link */}
      <Link href="/login" className={"form-end-link"}>
        Login
      </Link>
    </div>
  );
};

export default ResetPasswordForm;
