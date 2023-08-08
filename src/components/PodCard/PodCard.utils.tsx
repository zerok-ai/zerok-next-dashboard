import { parseTimeseriesData } from "utils/timeSeries";
import { type GenericObject } from "utils/types";

export const transformTimeSeries = (data: GenericObject) => {
  const timeseries: GenericObject = { cpu: {}, http: {}, latency: {} };

  const cpuData = parseTimeseriesData(data.cpuUsage?.results || []);
  const httpData = parseTimeseriesData(data.errAndReq?.results || []);
  const timeseriesLatencyData = parseTimeseriesData(
    data.latency?.results || []
  );
  timeseries.cpu.data = cpuData.cpu || [];
  timeseries.cpu.time = cpuData.time || [];

  timeseries.http.data = httpData.http || [];
  timeseries.http.time = httpData.time || [];

  timeseries.latency.data = timeseriesLatencyData.latency || [];
  timeseries.latency.time = timeseriesLatencyData.time || [];
  return timeseries;
};
