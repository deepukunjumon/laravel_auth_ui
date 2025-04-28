// Utility for status mappings for different types

export const userStatusMap = {
  1: { label: "Active", color: "success" },
  0: { label: "Disabled", color: "warning" },
  "-1": { label: "Deleted", color: "error" },
  Active: { label: "Active", color: "success" },
  Disabled: { label: "Disabled", color: "warning" },
  Deleted: { label: "Deleted", color: "error" },
};

// Add more mappings for other types as needed, e.g.:
// export const orderStatusMap = { ... };

export function getStatusChipProps(type, status) {
  let map;
  switch (type) {
    case "user":
      map = userStatusMap;
      break;
    // case "order":
    //   map = orderStatusMap;
    //   break;
    default:
      map = {};
  }
  const entry = map[status];
  if (entry) {
    return { label: entry.label, color: entry.color, variant: "filled" };
  }
  return { label: status, color: "default", variant: "filled" };
}
