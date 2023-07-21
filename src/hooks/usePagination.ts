import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// ==============================|| CARD - PAGINATION ||============================== //

export default function usePagination(
  itemsPerPage: number,
  totalItems: number
) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(
    router.query.page ? Number(router.query.page) : 1
  );
  const maxPage = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    console.log("here", router.query.page, currentPage);
    if (router.query.page && Number(router.query.page) !== currentPage) {
      setCurrentPage(Number(router.query.page));
    }
  }, [router.query]);

  const pushPage = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  function next() {
    const page = Math.min(currentPage + 1, maxPage);
    setCurrentPage(page);
    pushPage(page);
  }

  function prev() {
    const page = Math.max(currentPage - 1, 1);
    setCurrentPage(page);
    pushPage(page);
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);
    const newPage = Math.min(pageNumber, maxPage);
    setCurrentPage(newPage);
    pushPage(newPage);
  }

  return { next, prev, jump, currentPage, maxPage };
}
