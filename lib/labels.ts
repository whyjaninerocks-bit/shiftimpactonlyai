import type { DataMode, IndexedDirection } from "@/lib/types";

export const modeLabels: Record<DataMode, string> = {
  confirmed: "Confirmed",
  indexed: "Indexed",
  proxied: "Proxied",
};

export const directionLabels: Record<IndexedDirection, string> = {
  up: "Higher",
  flat: "Same",
  down: "Lower",
};

export function modeBadge(mode: DataMode) {
  if (mode === "confirmed") return "Conf";
  if (mode === "indexed") return "Index";
  return "Prox";
}
