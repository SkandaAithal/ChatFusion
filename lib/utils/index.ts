import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_URL } from "../constants";
import { SERVERS_API, USER_PROFILE_API } from "../routes";
import { axiosInstance } from "./axios";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBrowser = (): boolean => typeof window !== "undefined";

export function getInitials(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length === 0 || nameParts[0] === "") return "";
  return (
    nameParts[0].charAt(0).toUpperCase() +
      nameParts[1]?.charAt(0).toUpperCase() || ""
  );
}

export const isEmpty = (object: any): boolean => {
  if (
    object === null ||
    object === undefined ||
    object === false ||
    object === ""
  )
    return true;

  if (Array.isArray(object))
    return object.length === 0 || object.every(isEmpty);

  if (typeof object === "object") {
    return (
      Object.keys(object).length === 0 || Object.values(object).every(isEmpty)
    );
  }

  return false;
};

export function getAPIUrl(apiUrl: string): string {
  return `${APP_URL}${apiUrl}`;
}

export const queryData = async (apiUrl: string) => {
  const response = await axiosInstance.get(getAPIUrl(apiUrl));
  return response.data;
};
