import { isNumber } from "lodash";
import { useEffect, useRef, useState } from "react";

export const useSticky = () => {
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const fixedHeader = () => {
    const mainHeader = document.getElementById("incident-header");
    let fixedTop = stickyRef.current?.offsetTop;
    if (mainHeader && stickyRef.current && isNumber(fixedTop)) {
      if (window.pageYOffset > fixedTop + mainHeader.offsetHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  };
  useEffect(() => {
    return () => window.removeEventListener("scroll", fixedHeader);
  }, []);

  if (window !== undefined) {
    window.addEventListener("scroll", fixedHeader);
  }
  return { stickyRef, isSticky };
};
