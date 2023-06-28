import { TOKEN_NAME } from "./constants";

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
