import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const getRelativeTime = (date: string): string => {
  const isValid = dayjs(date).isValid();
  if (isValid) {
    return dayjs().to(dayjs(date));
  }
  return date;
};

export const getFormattedTime = (date: string): string => {
  const isValid = dayjs(date).isValid();
  if (isValid) {
    return dayjs(date).format("DD MMM,YYYY hh:mm:ss A");
  }
  return date;
};
