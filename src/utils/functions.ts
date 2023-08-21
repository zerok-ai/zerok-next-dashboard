import CryptoJS from "crypto-js";
import { toNumber } from "lodash";

import { IGNORED_SERVICES_PREFIXES, TOKEN_NAME } from "./constants";
import { type ServiceDetail } from "./types";

export const capitalizeFirstLetter = (str: string): string => {
  if (str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
};

export const setLocalToken = (token: string): boolean => {
  localStorage.setItem(TOKEN_NAME, token);
  return true;
};

export const getLocalToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_NAME);
  return token;
};

export const deleteLocalToken = (): boolean => {
  localStorage.removeItem(TOKEN_NAME);
  return true;
};

export const maskPassword = (password: string): string => {
  const shaArray = CryptoJS.SHA256(password);
  const hexPass = shaArray.toString(CryptoJS.enc.Hex);
  return hexPass;
};

export const getNamespace = (nameStr: string): string => {
  const getName = (str: string): string => {
    return str.toString().split("/")[0];
  };
  try {
    const namesObj = JSON.parse(nameStr);
    return getName(namesObj[0]);
  } catch (err) {}

  if (Array.isArray(nameStr)) {
    return getName(nameStr[0]);
  }
  return nameStr.split("/")[0];
};

export const filterByIgnoredService = (
  services: ServiceDetail[]
): ServiceDetail[] => {
  return services.filter((service) => {
    return IGNORED_SERVICES_PREFIXES.includes(getNamespace(service.service));
  });
};

export const stripNS = (nameStr: string): string => {
  return nameStr.split("/")[1];
};

export const getFormattedServiceName = (nameStr: string): string => {
  try {
    const namesObj = JSON.parse(nameStr);
    nameStr = stripNS(namesObj[0]);
    return nameStr;
  } catch (err) {}
  return stripNS(nameStr);
};

export const convertNanoToMilliSeconds = (
  value: number | null,
  addMs: boolean = true
): string | number => {
  if (value != null) {
    const millis = parseFloat((value / 1000000).toFixed(2));
    console.log(millis);
    return addMs ? `${millis} ms` : millis;
  }
  return "NA";
};

export const trimString = (str: string, length: number): string => {
  if (str.length > length) {
    return str.substring(0, length) + "...";
  } else return str;
};

export const roundToTwoDecimals = (value: number): number | string => {
  if (value != null) {
    return parseFloat(value.toFixed(2));
  }
  return "NA";
};

export const stringWithoutComments = (s: string): string => {
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

export const convertNanoToMilliSecondsNumber = (value: number): number => {
  if (value != null) {
    const millis = parseFloat((value / 1000000).toFixed(2));
    return millis;
  }
  return 0;
};

export const filterServices = (newData: ServiceDetail[]): ServiceDetail[] => {
  return newData.filter(
    (sv) => !IGNORED_SERVICES_PREFIXES.includes(getNamespace(sv.service))
  );
};

export const getNumberFromReqThroughput = (val: number) => {
  const reqPerSecond = roundToTwoDecimals(toNumber(val));
  return Number(reqPerSecond) > 0.1 ? reqPerSecond : "< 0.1";
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
