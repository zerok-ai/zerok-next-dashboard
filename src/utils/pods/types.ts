export interface PodInfoType {
  app_kubernetes_io_component: string;
  app_kubernetes_io_instance: string;
  app_kubernetes_io_managed_by: string;
  app_kubernetes_io_name: string;
  app_kubernetes_io_part_of: string;
  app_kubernetes_io_version: string;
  created_by_kind: string;
  created_by_name: string;
  helm_sh_chart: string;
  host_ip: string;
  host_network: string;
  image: string;
  image_id: string;
  image_spec: string;
  instance: string;
  job: string;
  namespace: string;
  node: string;
  pod: string;
  pod_ip: string;
  service: string;
  uid: string;
}

export interface ContainerInfoType {
  container: string;
  container_id: string;
  image: string;
  image_id: string;
  image_spec: string;
}

export interface CpuUsageType {
  time_stamp: number[];
  values: number[];
}

export interface MemUsageType {
  time_stamp: number[];
  values: number[];
}

export interface PodDetailResponseType {
  pod_info: PodInfoType;
  container_info: ContainerInfoType[];
  cpu_usage: Record<string, CpuUsageType>;
  mem_usage: Record<string, MemUsageType>;
}

export interface PodListType {
  name: string;
  namespace: string;
}
