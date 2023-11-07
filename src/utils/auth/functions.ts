import { type UserProfileType } from "redux/auth/authTypes";
import { deleteLocalToken, setLocalToken } from "utils/functions";
import { removeRaxiosHeader, setRaxiosHeader } from "utils/raxios";

import { ZK_USER_LOCAL_NAME } from "./constants";

export const setRaxiosLocalToken = (token: string): void => {
  setLocalToken(token);
  setRaxiosHeader(token);
};

export const setLocalProfile = (profile: UserProfileType): void => {
  localStorage.setItem(ZK_USER_LOCAL_NAME, JSON.stringify(profile));
};

export const getLocalProfile = (): UserProfileType | null => {
  const profile = localStorage.getItem(ZK_USER_LOCAL_NAME);
  if (profile) {
    return JSON.parse(profile);
  }
  return null;
};

export const removeLocalProfile = (): void => {
  localStorage.removeItem(ZK_USER_LOCAL_NAME);
};

export const removeLocalUser = (): void => {
  deleteLocalToken();
  removeRaxiosHeader();
  removeLocalProfile();
};
