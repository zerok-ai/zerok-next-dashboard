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

export const getRelativeTimeFromEpoc = (date: number) => {
  const isValid = dayjs.unix(date).isValid();
  if (isValid) {
    return dayjs().to(dayjs.unix(date));
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

export const getFormattedTimeFromEpoc = (date: number) => {
  const isValid = dayjs.unix(date).isValid();
  if (isValid) {
    return dayjs.unix(date).format("DD MMM,YYYY hh:mm:ss A");
  }
  return date;
};

export const formatDuration = (milliseconds: number) => {
  const seconds = milliseconds / 1000;

  if (seconds < 1) {
    return `${milliseconds.toFixed(2)} ms`;
  } else if (seconds < 60) {
    return `${seconds.toFixed(2)} s`;
  } else if (seconds < 3600) {
    const minutes = seconds / 60;
    return `${minutes.toFixed(2)} m`;
  } else {
    const hours = seconds / 3600;
    return `${hours.toFixed(2)} h`;
  }
};
