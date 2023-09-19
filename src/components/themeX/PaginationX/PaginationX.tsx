import { Button, Pagination } from "@mui/material";
import usePagination from "hooks/usePagination";

import styles from "./PaginationX.module.scss";

interface PaginationXProps {
  itemsPerPage: number;
  totalItems: number;
}

const PaginationX = ({ itemsPerPage, totalItems }: PaginationXProps) => {
  const { next, prev, jump, currentPage, maxPage } = usePagination(
    itemsPerPage,
    totalItems
  );
  return (
    <div className={styles.container}>
      <Button
        color="secondary"
        onClick={prev}
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
          jump(page);
        }}
        className={styles.pagination}
      />
      <Button
        color="secondary"
        onClick={next}
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
