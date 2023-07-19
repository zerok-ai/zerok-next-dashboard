import { convertNanoToMilliSecondsNumber } from "./functions";
import { type GenericObject } from "./types";

interface GenericTimeSeriesDataType {
  name: string;
  data: number[];
}

export const parseTimeseriesData = (detailsArr: any[]): GenericObject => {
  const detailsMap = new Map();
  for (let i = 0; i < detailsArr.length; i++) {
    const obj = detailsArr[i];
    detailsMap.set(obj.time, obj);
  }
  const detailsMapSorted = new Map(
    [...detailsMap].sort((a, b) => {
      if (new Date(String(a[0])) < new Date(String(b[0]))) {
        return -1;
      }
      if (new Date(String(a[0])) > new Date(String(b[0]))) {
        return 1;
      }
      return 0;
    })
  );

  const latencyValues: GenericTimeSeriesDataType[] = [
    {
      name: "p50",
      data: [],
    },
    {
      name: "p90",
      data: [],
    },
    {
      name: "p99",
      data: [],
    },
  ];
  const connsValues: GenericTimeSeriesDataType[] = [
    {
      name: "in",
      data: [],
    },
    {
      name: "out",
      data: [],
    },
  ];
  const httpValues: GenericTimeSeriesDataType[] = [
    {
      name: "throughput",
      data: [],
    },
    {
      name: "error_rate",
      data: [],
    },
  ];

  const cpuUsage: GenericTimeSeriesDataType[] = [
    {
      name: "cpu_usage",
      data: [],
    },
  ];

  const timeStamps = [] as string[];
  detailsMapSorted.forEach((value, key) => {
    latencyValues[0].data.push(
      convertNanoToMilliSecondsNumber(value.latency_p50)
    );
    latencyValues[1].data.push(
      convertNanoToMilliSecondsNumber(value.latency_p90)
    );
    latencyValues[2].data.push(
      convertNanoToMilliSecondsNumber(value.latency_p99)
    );
    connsValues[0].data.push(value.inbound_throughput);
    connsValues[1].data.push(value.outbound_throughput);
    httpValues[0].data.push(parseFloat(value.request_throughput));
    httpValues[1].data.push(parseFloat(value.error_rate));
    cpuUsage[0].data.push(value.cpu_usage);
    timeStamps.push(value.time);
  });
  return {
    time: timeStamps,
    latency: latencyValues,
    conns: connsValues,
    http: httpValues,
    cpu: cpuUsage,
  };
};
