import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import cx from "classnames";
import styles from "./LoginForm.module.scss";
import { Button, InputAdornment } from "@mui/material";
import TextFormField from "components/TextFormField";
import VisibilityToggleButton from "components/VisibilityToggleButton";
import { useState } from "react";
import Link from "next/link";
import { maskPassword } from "utils/functions";
import raxios from "utils/raxios";
import { LOGIN_ENDPOINT } from "utils/endpoints";
import { useDispatch } from "redux/store";
import { loginUser, logoutUser } from "redux/authSlice";
import { useSelector } from "redux/store";
import { LoadingButton } from "@mui/lab";

const loginSchema = z.object({
  email: z.string().email().min(1, "Email cannot be empty"),
  password: z.string().min(1, "Password cannot be empty"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const [status, setStatus] = useState({ loading: false, error: false });
  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<LoginSchemaType> = async ({
    password,
    email,
  }) => {
    try {
      setStatus({ loading: true, error: false });
      const encrypted = maskPassword(password);
      const rdata = await raxios.post(LOGIN_ENDPOINT, {
        email,
        password: encrypted,
      });
      const token = rdata.headers.token;
      if (token) {
        dispatch(loginUser({ token }));
      } else {
        dispatch(logoutUser());
        throw "Could not login user";
      }
    } catch (err) {
      setStatus((old) => ({ ...old, error: true }));
    } finally {
      setStatus((old) => ({ ...old, loading: false }));
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { auth } = useSelector((state) => state);

  return (
    <div className={styles["container"]}>
      <form
        className={cx("form", styles["form"])}
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
        {/* Password field */}
        <TextFormField
          name="password"
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Your ZeroK password"
          label="Enter your password"
          register={register}
          customClassName={styles["form-field"]}
          error={!!errors.password}
          errorText={errors.password?.message}
          helperText="Passwords are case-sensitive"
          endAdornment={
            <InputAdornment position="end">
              <VisibilityToggleButton
                name="password"
                onChange={(val) => setIsPasswordVisible(val)}
              />
            </InputAdornment>
          }
        />

        {/* Submit button */}
        <LoadingButton variant="contained" color="primary" type="submit" loading={status.loading}>
          Login
        </LoadingButton>
      </form>
      {/* Form error - Login issue */}
      {status.error && (
        <p className="form-error">
          Could not log in user, please try again.
        </p>
      )}
      {/* Forgot password link */}
      <Link href="/forgot-password" className={cx("form-end-link")}>
        Forgot password?
      </Link>
    </div>
  );
};

export default LoginForm;
