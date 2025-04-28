// Utility for status mappings for different types

import { userStatusMap } from '../constants/status';

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
