import { z } from "zod";

export const signUpFormSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .transform((val) => val.trim()),

  lastname: z
    .string()
    .min(1, { message: "Last name should not be left empty" })
    .transform((val) => val.trim()),

  email: z
    .string()
    .email({ message: "Invalid email address." })
    .refine(
      (value) =>
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value) &&
        /.+\.[a-z]{2,}$/.test(value),
      {
        message:
          "Email must be a valid email address with a proper domain and lowercase letters.",
      }
    )
    .transform((val) => val.trim()),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .transform((val) => val.trim()),
});

export const signInFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .refine(
      (value) =>
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value) &&
        /.+\.[a-z]{2,}$/.test(value),
      {
        message:
          "Email must be a valid email address with a proper domain and lowercase letters.",
      }
    )
    .transform((val) => val.trim()),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .transform((val) => val.trim()),
});

export const TOKEN = "idToken";
export const EXPIRY_TIME = "expiresIn";
export const USER_INFO = "userInfo";
export const SIGN_IN_SUCCESSFUL = "Signed in successfully";
