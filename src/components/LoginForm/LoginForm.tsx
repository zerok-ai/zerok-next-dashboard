import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
import styles from "./LoginForm.module.scss";
import { FormControl, TextField, InputLabel, Button } from "@mui/material";
import TextFormField from "components/TextFormField";


const LoginForm = () => {
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = (values) => {
    console.log({ values });
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["logo-container"]}>
        <img src="/images/brand/zerok_logo_light.svg" alt="zerok_logo" />
      </div>
      <form
        className={cx("form", styles["form"])}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextFormField
          name="email"
          placeholder="Your ZeroK email"
          label="Enter your email"
          register={register}
          customClassName={styles["form-field"]}
        />
        <TextFormField
          name="password"
          placeholder="Your ZeroK password"
          label="Enter your password"
          register={register}
          customClassName={styles["form-field"]}
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
