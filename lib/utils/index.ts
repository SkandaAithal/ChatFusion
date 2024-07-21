import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
