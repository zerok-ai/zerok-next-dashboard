import objectPath from "object-path";
import { useEffect, useState } from "react";
import raxios from "utils/raxios";
import { sendError } from "utils/sentry";

export const useFetch = <T>(
  accessor: string,
  url?: string | null,
  transformer?: (newData: T, oldData: T) => T,
  replaceNull: boolean = false
) => {
  // @TODO - add generics here to get  better type detection
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [errorData, setErrorData] = useState<any>(null); // @TODO - add type here
  const fetchData = async (endpoint: string) => {
    try {
      setLoading(true);
      setError(false);
      setErrorData(null);
      const resp = await raxios.get(endpoint);
      const rdata = objectPath.get(resp.data.payload, accessor);
      if (replaceNull && rdata === null) setData([] as T);
      if (transformer != null) setData(transformer(rdata, data as T));
      else setData(rdata);
    } catch (err) {
      setError(true);
      setErrorData(err);
      sendError(err);
    } finally {
      setLoading(false);
      setInitialFetchDone(true);
    }
  };

  useEffect(() => {
    if (url !== null && url !== undefined) fetchData(url);
  }, [url]);

  const resetInitialFetch = () => {
    setInitialFetchDone(false);
  };
  return {
    data,
    loading,
    error,
    fetchData,
    setData,
    errorData,
    initialFetchDone,
    resetInitialFetch,
  };
};
