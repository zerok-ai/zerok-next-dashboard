import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const getRelativeTime = (date: string) => {
  const isValid = dayjs(date).isValid();
  if (isValid) {
    return dayjs().to(dayjs(date));
  }
  return date;
};
