import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import objectPath from "object-path";
import raxios from "utils/raxios";
import { GenericObject } from "utils/types";

export const useFetch = <T>(
  accessor: string,
  url?: string | null,
  transformer?: (newData: T, oldData: T) => T
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
      if (transformer) setData(transformer(rdata, data as T));
      else setData(rdata);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) fetchData(url);
  }, [url]);
  return { data, loading, error, fetchData };
};
