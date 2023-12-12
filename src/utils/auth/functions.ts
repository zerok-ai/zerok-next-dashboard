import { deleteLocalToken, setLocalToken } from "utils/functions";
import { removeRaxiosHeader, setRaxiosHeader } from "utils/raxios";

export const setRaxiosLocalToken = (token: string): void => {
  setLocalToken(token);
  setRaxiosHeader(token);
};

export const removeLocalUser = (): void => {
  deleteLocalToken();
  removeRaxiosHeader();
};

export const getSecondsToExpiry = (exp: number) => {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
  const secondsToExpiry = exp - currentTimestamp;
  return secondsToExpiry;
};
