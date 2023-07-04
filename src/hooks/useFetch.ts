import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import raxios from "utils/raxios";
import { GenericObject } from "utils/types";

export const useFetch = <T>(url: string, accessor: string) => {
  // @TODO - add generics here to get  better type detection
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const rdata = await raxios.get(url);
      setData(rdata.data.payload[accessor]);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);
  return { data, loading, error, fetchData };
};
