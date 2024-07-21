import { AxiosError, AxiosResponse } from "axios";
import { FirebaseError } from "firebase/app";

export type ApiErrorType = string & Error & AxiosError;

export type ErrorType = string | Error | AxiosError | null | FirebaseError;
export type StatusType = "idle" | "pending" | "resolved" | "rejected";

export type Data<T> = T | null;

export interface AsyncState<T> {
  status: StatusType;
  data: Data<T> | AxiosResponse;
  error: ErrorType;
}
