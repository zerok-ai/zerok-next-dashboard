import { Modal } from "@mui/material";
import React, { Fragment } from "react";

import styles from "./TreeWrapper.module.scss";

interface TreeWrapperProps {
  isModalOpen: boolean;
  children: React.ReactNode;
  onModalClose: () => void;
}

const TreeWrapper = ({
  isModalOpen,
  children,
  onModalClose,
}: TreeWrapperProps) => {
  if (isModalOpen) {
    return (
      <Modal
        open={true}
        onClose={onModalClose}
        keepMounted={true}
        className={styles.modal}
        hideBackdrop={true}
      >
        <Fragment>
          <div
            className={styles.backdrop}
            role="presentation"
            onClick={onModalClose}
          ></div>
          {children}
        </Fragment>
      </Modal>
    );
  } else return <Fragment>{children}</Fragment>;
};

export default TreeWrapper;
