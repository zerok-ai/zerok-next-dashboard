export const getMBfromBytes = (value: number) => {
  const mb = 1024 * 1024;
  const converted = value / mb;
  return Math.ceil(converted); // 1 MB = 1024 KB, 1 KB = 1024 bytes
};

export const formatCPUUsage = (value: number) => {
  return value.toFixed(5);
};
