import type { Product } from "@/types";

// The public API can return incomplete records; skip them instead of crashing.
export function isValidProduct(p: Product | null | undefined): p is Product {
  return (
    !!p &&
    typeof p.id === "number" &&
    typeof p.title === "string" &&
    p.title.trim().length > 0 &&
    typeof p.price === "number"
  );
}

export function truncate(text: string, max = 160): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}