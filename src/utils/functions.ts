import { TOKEN_NAME } from "./constants";

import CryptoJS from "crypto-js";

export const capitalizeFirstLetter = (str: string) => {
  if (str.length) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
};

export const setLocalToken = (token: string) => {
  localStorage.setItem(TOKEN_NAME, token);
  return true;
};

export const getLocalToken = () => {
  return localStorage.getItem(TOKEN_NAME) || null;
};

export const deleteLocalToken = () => {
  localStorage.removeItem(TOKEN_NAME);
  return true;
};

export function maskPassword(password: string) {
  let shaArray = CryptoJS.SHA256(password);
  let hexPass = shaArray.toString(CryptoJS.enc.Hex);
  return hexPass;
}