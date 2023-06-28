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

  const onSubmit: SubmitHandler<LoginSchemaType> = (values) => {
    console.log({ values });
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
      {/* Forgot password link */}
      <Link href="/forgot-password" className={cx("form-end-link")}>
        Forgot password?
      </Link>
    </div>
  );
};

export default LoginForm;
