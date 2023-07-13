import { Button, Drawer } from "@mui/material";
import styles from "./CreateNewIssueDrawer.module.scss";
import { HiPlus } from "react-icons/hi";
import { useState } from "react";
import { ICONS, ICON_BASE_PATH } from "utils/images";

import cx from "classnames";
import { useForm } from "react-hook-form";
import TextFormField from "components/forms/TextFormField";

const CreateNewIssueDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDrawer = () => {
    setIsOpen(false);
  };
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div className={styles["container"]}>
      <Button
        variant="contained"
        color="primary"
        className={styles["new-issue-btn"]}
        onClick={toggleDrawer}
      >
        New Issues Type <HiPlus className={styles["plus-icon"]} />
      </Button>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={closeDrawer}
        hideBackdrop
        className={styles["drawer"]}
      >
        <div className={styles["header"]}>
          <h6>Define New Issue Type</h6>
          <span
            className={styles["close-btn"]}
            onClick={closeDrawer}
            role="button"
          >
            <img
              src={`${ICON_BASE_PATH}/${ICONS["close-circle"]}`}
              alt="close"
            />
          </span>
        </div>

        <div className={styles["form-content"]}>
          <form className={styles["form"]}>
            <div className={cx(styles["form-item"], styles["name-item"])}>
              <TextFormField
                name="name"
                label="Name this incident type"
                placeholder="Give a unique name"
                register={register}
                error={!!errors.name}
                errorText={errors.name?.message as string}
              />
            </div>
            <div className={cx(styles["conditions-container"])}>
              <p>Define outlier conditions</p>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
};

export default CreateNewIssueDrawer;
