import type { SimulatedOrder } from "@/types";

const KEY = "last-simulated-order";

export function saveLastOrder(order: SimulatedOrder): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // storage blocked: the success page will show its empty state
  }
}

export function readLastOrder(): SimulatedOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items) && typeof parsed.total === "number" && parsed.customer) {
      return parsed as SimulatedOrder;
    }
    return null;
  } catch {
    return null;
  }
}