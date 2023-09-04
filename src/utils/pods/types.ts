// {
//     "podName": "podname",
//     "metadata": {
//       "app_kubernetes_io_component": "metrics",
//       "app_kubernetes_io_instance": "prometheus-graf",
//       "app_kubernetes_io_managed_by": "Helm",
//       "app_kubernetes_io_name": "kube-state-metrics",
//       "app_kubernetes_io_part_of": "kube-state-metrics",
//       "app_kubernetes_io_version": "2.9.2",
//       "container": "zk-wsp-client",
//       "container_id": "containerd://4c46ef14e30682f855a8c5cd0ff4e720dd63e3abd1181ca727ac4b6e0ae4ab08",
//       "created_by_kind": "ReplicaSet",
//       "created_by_name": "zk-wsp-client-6c44c7c5d6",
//       "helm_sh_chart": "kube-state-metrics-5.10.1",
//       "host_ip": "10.138.0.12",
//       "host_network": "false",
//       "image": "us-west1-docker.pkg.dev/zerok-dev/stage/zk-wsp-client:dev",
//       "image_id": "us-west1-docker.pkg.dev/zerok-dev/stage/zk-wsp-client@sha256:9de4288ad62acfd5f92353f814d5e02ad7ff77c00f7adbabb60f09f0908234bf",
//       "image_spec": "us-west1-docker.pkg.dev/zerok-dev/stage/zk-wsp-client:dev",
//       "instance": "10.40.0.4:8080",
//       "job": "kubernetes-service-endpoints",
//       "namespace": "zk-client",
//       "node": "gke-devclient03-default-pool-8baee670-m0f7",
//       "pod": "zk-wsp-client-6c44c7c5d6-r8k6x",
//       "pod_ip": "10.40.1.24",
//       "service": "prometheus-graf-kube-state-metrics",
//       "uid": "8ff6ea9d-1dce-4d21-9d70-7bfe51a7b43e"
//     },
//     "zkInferences": "zkInferences",
//     "cpuUsage": {
//       "title": "CPU Usage",
//       "success": true,
//       "frames": [
//         {
//           "schema": {
//             "name": "zk-wsp-client"
//           },
//           "data": {
//             "timeStamp": [
//               1693538700000,
//               1693538730000,
//               1693538760000,
//               1693538790000,
//               1693538820000,
//               1693538850000,
//               1693538880000,
//               1693538910000,
//               1693538940000,
//               1693538970000,
//               1693539000000,
//               1693539030000,
//               1693539060000,
//               1693539090000,
//               1693539120000,
//               1693539150000,
//               1693539180000,
//               1693539210000,
//               1693539240000,
//               1693539270000,
//               1693539300000,
//               1693539330000,
//               1693539360000,
//               1693539390000,
//               1693539420000,
//               1693539450000,
//               1693539480000,
//               1693539510000,
//               1693539540000,
//               1693539570000,
//               1693539600000,
//               1693539630000,
//               1693539660000,
//               1693539690000,
//               1693539720000,
//               1693539750000,
//               1693539780000,
//               1693539810000,
//               1693539840000,
//               1693539870000,
//               1693539900000
//             ],
//             "values": [
//               0.001151833631484815,
//               0.001151434927132915,
//               0.001151434927132915,
//               0.0011364635665264955,
//               0.0011364635665264955,
//               0.0011768231594170302,
//               0.0011768231594170302,
//               0.001199976815316182,
//               0.0011999768153161821,
//               0.001150542477617351,
//               0.001150542477617351,
//               0.0011842938984552977,
//               0.0011842938984552977,
//               0.0010776827865754254,
//               0.0010776827865754256,
//               0.0010739660935046318,
//               0.0010739660935046318,
//               0.0014018217532924973,
//               0.0014018217532924973,
//               0.0014852646537039012,
//               0.0014852646537039012,
//               0.0014017614321992459,
//               0.0014017614321992459,
//               0.0012989925529764727,
//               0.0012989925529764727,
//               0.0012886233902112806,
//               0.0012886233902112806,
//               0.0013001925260403941,
//               0.0013001925260403941,
//               0.0014175240099986686,
//               0.0014175240099986686,
//               0.001425476259677131,
//               0.001425476259677131,
//               0.001377601185264988,
//               0.001377601185264988,
//               0.0013816613823715747,
//               0.0013816613823715747,
//               0.0013106811501192638,
//               0.0013106811501192638,
//               0.0013125323480933705,
//               0.001863044272207128
//             ]
//           }
//         }
//       ]
//     },
//     "memUsage": {
//       "title": "Memory Usage",
//       "success": true,
//       "frames": [
//         {
//           "schema": {
//             "name": "zk-wsp-client"
//           },
//           "data": {
//             "values": [
//               [
//                 1693538700000,
//                 1693539000000,
//                 1693539300000,
//                 1693539600000,
//                 1693539900000
//               ],
//               [
//                 205369344,
//                 208420864,
//                 210104320,
//                 212611072,
//                 215994368
//               ]
//             ]
//           }
//         }
//       ]
//     }
//   }

export interface PodDetailResponseType {
  podName: string;
  metadata: {
    app_kubernetes_io_component: string;
    app_kubernetes_io_instance: string;
    app_kubernetes_io_managed_by: string;
    app_kubernetes_io_name: string;
    app_kubernetes_io_part_of: string;
    app_kubernetes_io_version: string;
    container: string;
    container_id: string;
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
  };
  cpuUsage: {
    title: string;
    success: boolean;
    frames: Array<{
      schema: {
        name: string;
      };
      data: {
        timeStamp: number[];
        values: number[];
      };
    }>;
  };
  memUsage: {
    title: string;
    success: boolean;
    frames: Array<{
      schema: {
        name: string;
      };
      data: {
        timeStamp: number[];
        values: number[];
      };
    }>;
  };
}
//       "container_id": "containerd://4c46ef14e30682f855a8c5cd0ff4e720dd63e3abd1181ca727ac4b6e0ae4ab08",
//       "created_by_kind": "ReplicaSet",
//       "created_by_name": "zk-wsp-client-6c44c7c5d6",
//       "helm_sh_chart": "kube-state-metrics-5.10.1",
//       "host_ip": "10.138.0.12",
//       "host_network": "false",
//       "image": "us-west1-docker.pkg.dev/zerok-dev/stage/zk-wsp-client:dev",
//       "image_id": "us-west1-docker.pkg.dev/zerok-dev/stage/zk-wsp-client@sha256:9de4288ad62acfd5f92353f814d5e02ad7ff77c00f7adbabb60f09f0908234bf",
//       "image_spec": "us-west1-docker.pkg.dev/zerok-dev/stage/zk-wsp-client:dev",
//       "instance": "10.40.0.4:8080",
//       "job": "kubernetes-service-endpoints",
//       "namespace": "zk-client",
//       "node": "gke-devclient03-default-pool-8baee670-m0f7",
//       "pod": "zk-wsp-client-6c44c7c5d6-r8k6x",
//       "pod_ip": "10.40.1.24",
//       "service": "prometheus-graf-kube-state-metrics",
