export const getServiceString = (name: string) => {
  if (name.includes("[") && name.includes("]")) {
    try {
      const svc = JSON.parse(name);
      if (Array.isArray(svc)) {
        return svc[0];
      } else return svc;
    } catch (err) {
      return name;
    }
  } else {
    return name;
  }
};
