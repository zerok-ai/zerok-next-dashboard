import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { InputAdornment } from "@mui/material";
import cx from "classnames";
import TextFormField from "components/forms/TextFormField";
import VisibilityToggleButton from "components/helpers/VisibilityToggleButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "redux/store";
import { loginUser } from "redux/thunks/auth";
import { z } from "zod";

import styles from "./LoginForm.module.scss";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email cannot be empty"),
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchemaType> = async (values) => {
    dispatch(loginUser(values));
  };

  const auth = useSelector((state) => state.auth);

  // if user logged in, redirect to home page
  useEffect(() => {
    if (auth.isLoggedIn && auth.token) {
      const redirect = localStorage.getItem("redirect");
      if (redirect) {
        router.push(redirect);
        localStorage.removeItem("redirect");
      } else {
        router.push("/");
      }
    }
  }, [auth.token, auth.isLoggedIn]);

  return (
    <Fragment>
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
          autoComplete="on"
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
                onChange={(val) => {
                  setIsPasswordVisible(val);
                }}
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
          loading={auth.loading}
        >
          Login
        </LoadingButton>
      </form>

      {/* Forgot password link */}
      <Link href="/forgot-password" className={cx("form-end-link")}>
        Forgot password?
      </Link>
      <br />
      {/* Form error - Login issue */}
      {auth.error && <p className="form-error">{auth.error}</p>}
    </Fragment>
  );
};

export default LoginForm;
