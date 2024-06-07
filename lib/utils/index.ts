import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(fullName: string): string {
  const [firstName, lastName] = fullName.trim().split(/\s+/);
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
