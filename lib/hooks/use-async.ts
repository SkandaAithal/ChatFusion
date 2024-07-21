"use client";

import axios from "axios";
import { AsyncState, Data, ErrorType } from "../types/hooks/use-async";
import { useCallback, useMemo, useReducer } from "react";

const useAsync = <T>() => {
  const defaultState: AsyncState<any> = {
    status: "idle",
    data: null,
    error: null,
  };

  const reducer = (
    oldState: AsyncState<T>,
    newState: Partial<AsyncState<T>>
  ) => ({
    ...oldState,
    ...newState,
  });

  const [{ status, data, error }, dispatch] = useReducer(reducer, defaultState);

  const setData = useCallback(
    (dData: Data<T>) => {
      dispatch({ data: dData, status: "resolved" });
    },
    [dispatch]
  );

  const setError = useCallback((_error: ErrorType) => {
    dispatch({ error: _error, status: "rejected" });
  }, []);

  const PostApiCall = useCallback(
    async (apiUrl: string, payload: object) => {
      dispatch({ status: "pending", error: null });
      try {
        const resolvedData: T = await axios.post(apiUrl, payload);
        setData(resolvedData);
      } catch (_error) {
        setError(_error as ErrorType);
      }
    },
    [setData, setError]
  );

  return useMemo(
    () => ({
      isIdle: status === "idle",
      isLoading: status === "pending",
      isError: status === "rejected",
      isSuccess: status === "resolved",
      data,
      error,
      PostApiCall,
    }),
    [PostApiCall, data, error, status]
  );
};

export default useAsync;
