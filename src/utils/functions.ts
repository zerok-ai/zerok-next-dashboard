import { IGNORED_SERVICES_PREFIXES, TOKEN_NAME } from "./constants";

import CryptoJS from "crypto-js";
import { ServiceDetail } from "./types";

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

export const getNamespace = (nameStr: string) => {
  function getName(str: string) {
    return str.toString().split("/")[0];
  }
  try {
    let namesObj = JSON.parse(nameStr);
    return getName(namesObj[0]);
  } catch (err) {}

  if (Array.isArray(nameStr)) {
    return getName(nameStr[0]);
  }
  return nameStr.split("/")[0];
};

export const filterByIgnoredService = (services: ServiceDetail[]) => {
  return services.filter((service) => {
    return IGNORED_SERVICES_PREFIXES.includes(getNamespace(service.service));
  });
};

export const stripNS = (nameStr: string) => {
  return nameStr.split("/")[1];
};

export const getFormattedServiceName = (nameStr: string) => {
  try {
    let namesObj = JSON.parse(nameStr);
    nameStr = stripNS(namesObj[0]);
    return nameStr;
  } catch (err) {}
  return stripNS(nameStr);
};

export function convertNanoToMilliSeconds(value: number | null) {
  if (value != null) {
    let millis = parseFloat((value / 1000000).toFixed(2));
    return `${millis} ms`;
  }
  return "NA";
}


export const trimString = (str: string, length: number) => {
  if (str.length > length) {
    return str.substring(0, length) + "...";
  } else return str;
};

export function roundToTwoDecimals(value: number) {
  if (value != null) {
    return parseFloat(value.toFixed(2));
  }
  return "NA";
}

export const stringWithoutComments = (s: string) => {
  return s.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, "");
};

export const decodeLengthEncodedHexString = (hexStr: any): string[] => {
  const buffer = Buffer.from(hexStr, "binary");
  let offset = 0;

  const fields = [];

  while (offset < buffer.length) {
    const fieldLength = buffer.readUInt8(offset);
    offset += 1;

    const fieldData = buffer.slice(offset, offset + fieldLength);
    offset += fieldLength;

    fields.push(fieldData.toString("utf-8"));
  }
  return fields;
};
