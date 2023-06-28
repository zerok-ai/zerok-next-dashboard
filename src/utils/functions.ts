export const capitalizeFirstLetter = (str: string) => {
  if (str.length) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
};
