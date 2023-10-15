import { Button, Pagination } from "@mui/material";
import usePagination from "hooks/usePagination";

import styles from "./PaginationX.module.scss";

interface PaginationXProps {
  itemsPerPage: number;
  totalItems: number;
  externalCurrentPage?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onJump?: (page: number) => void;
}

const PaginationX = ({
  itemsPerPage,
  externalCurrentPage,
  onNext,
  onPrev,
  totalItems,
  onJump,
}: PaginationXProps) => {
  const {
    next,
    prev,
    jump,
    currentPage: internalCurrentPage,
    maxPage,
  } = usePagination(itemsPerPage, totalItems);
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  return (
    <div className={styles.container}>
      <Button
        color="secondary"
        onClick={() => {
          if (onPrev) {
            onPrev();
          } else {
            prev();
          }
        }}
        size="small"
        className={styles["next-prev-btns"]}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Pagination
        count={maxPage}
        page={currentPage}
        boundaryCount={1}
        color="primary"
        shape="rounded"
        hidePrevButton
        hideNextButton
        onChange={(_, page) => {
          if (onJump) {
            onJump(page);
          } else {
            jump(page);
          }
        }}
        className={styles.pagination}
      />
      <Button
        color="secondary"
        onClick={() => {
          if (onNext) {
            onNext();
          } else {
            next();
          }
        }}
        size="small"
        className={styles["next-prev-btns"]}
        disabled={currentPage === maxPage || maxPage === 0}
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationX;
