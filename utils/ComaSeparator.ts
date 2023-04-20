import { isNull, isUndefined } from "lodash";

export const ComaSeparator = (number: number | string) => {
  if (Number.isNaN(number) || isNull(number) || isUndefined(number)) {
    return "";
  }
  var num_parts = number.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
};
