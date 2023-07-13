import { convertNanoToMilliSecondsNumber } from "./functions";

export const parseTimeseriesData = (detailsArr: any[]) => {
  const detailsMap = new Map();
  for (var i = 0; i < detailsArr.length; i++) {
    var obj = detailsArr[i];
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

  var latencyValues: {
    name: string;
    data: number[];
  }[] = [
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
  var connsValues: {
    name: string;
    data: number[];
  }[] = [
    {
      name: "in",
      data: [],
    },
    {
      name: "out",
      data: [],
    },
  ];
  var httpValues: {
    name: string;
    data: number[];
  }[] = [
    {
      name: "throughput",
      data: [],
    },
    {
      name: "error_rate",
      data: [],
    },
  ];

  var cpuUsage: {
    name: string;
    data: number[];
  }[] = [
    {
      name: "cpu_usage",
      data: [],
    },
  ];
  var timeStamps = [] as string[];
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
