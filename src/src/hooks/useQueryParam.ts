import { useLocation } from "react-router-dom";

export function useQueryParam(value: string) {
  return new URLSearchParams(useLocation().search).get(value) || "";
}
