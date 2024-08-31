import axios from "axios";
import { ACCESS_TOKEN, APP_URL, REFRESH_TOKEN } from "../constants";

import { getTokenFromCookies } from "./server-actions";

export const axiosInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await getTokenFromCookies(ACCESS_TOKEN);
    const refreshToken = await getTokenFromCookies(REFRESH_TOKEN);
    if (accessToken && refreshToken) {
      config.headers.Authorization = `${accessToken} ${refreshToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
