import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

interface ApiPostParams {
  endpoint: string;
  body: object;
}

const usePostMutation = <T>(queryKeyToRefetch?: string[]) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<T, AxiosError, ApiPostParams>({
    mutationFn: async ({ endpoint, body }: ApiPostParams) => {
      const response = await axios.post(endpoint, body);
      return response.data;
    },
    onSuccess: () => {
      if (queryKeyToRefetch) {
        queryKeyToRefetch.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    },
  });

  const performPostRequest = useCallback(
    (endpoint: string, body: object) => {
      mutation.mutate({ endpoint, body });
    },
    [mutation]
  );

  return useMemo(
    () => ({
      isIdle: mutation.status === "idle",
      isLoading: mutation.status === "pending",
      isError: mutation.status === "error",
      isSuccess: mutation.status === "success",
      data: mutation.data,
      error: (mutation.error?.response?.data as Error) ?? mutation.error,
      performPostRequest,
    }),
    [performPostRequest, mutation.status, mutation.data, mutation.error]
  );
};

export default usePostMutation;
