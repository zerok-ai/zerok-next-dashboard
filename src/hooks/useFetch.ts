import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import raxios from "utils/raxios";
import { GenericObject } from "utils/types";

export const useFetch = <T>(
  accessor: string,
  url?: string,
  nullValue?: null
) => {
  // @TODO - add generics here to get  better type detection
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async (endpoint: string) => {
    try {
      setLoading(true);
      setError(false);
      const rdata = await axios.get(endpoint);
      setData(rdata.data.payload[accessor]);
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
