"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils";

interface FetchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, isLoading: false });
      })
      .catch((error) => {
        if (!cancelled)
          setState({ data: null, error: getErrorMessage(error), isLoading: false });
      });
    return () => {
      cancelled = true;
    };
    // fetcher is intentionally excluded: we only refetch on mount or reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    setNonce((n) => n + 1);
  }, []);

  return { ...state, reload };
}