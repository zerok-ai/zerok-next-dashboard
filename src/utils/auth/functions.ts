import { deleteLocalToken, setLocalToken } from "utils/functions";
import { removeRaxiosHeader, setRaxiosHeader } from "utils/raxios";

export const setRaxiosLocalToken = (token: string): void => {
  setLocalToken(token);
  setRaxiosHeader(token);
};

export const removeToken = (): void => {
  deleteLocalToken();
  removeRaxiosHeader();
};
