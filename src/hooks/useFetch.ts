import objectPath from "object-path";
import { useEffect, useState } from "react";
import raxios from "utils/raxios";

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

  const fetchData = async (endpoint: string) => {
    try {
      setLoading(true);
      setError(false);
      const resp = await raxios.get(endpoint);
      const rdata = objectPath.get(resp.data.payload, accessor);
      if (replaceNull && rdata === null) setData([] as T);
      if (transformer != null) setData(transformer(rdata, data as T));
      else setData(rdata);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url !== null && url !== undefined) fetchData(url);
  }, [url]);
  return { data, loading, error, fetchData, setData };
};
