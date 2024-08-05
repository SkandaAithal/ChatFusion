import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_URL } from "../constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length === 0 || nameParts[0] === "") return "";
  return (
    nameParts[0].charAt(0).toUpperCase() +
      nameParts[1]?.charAt(0).toUpperCase() || ""
  );
}

export const isEmpty = (object: any) => {
  if (!object) return true;
  if (Array.isArray(object)) return !object?.length;
  return !Object.keys(object).length;
};

export function getAPIUrl(apiUrl: string): string {
  return `${API_URL}${apiUrl}`;
}
