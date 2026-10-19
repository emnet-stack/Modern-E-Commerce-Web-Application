import { readStorage, writeStorage } from "@/lib/storage";

type Kind = "products" | "categories";

const keyFor = (kind: Kind) => `owned-${kind}`;

function read(kind: Kind): number[] {
  const value = readStorage<unknown>(keyFor(kind), []);
  return Array.isArray(value)
    ? value.filter((v): v is number => typeof v === "number")
    : [];
}

/** True only for records created from this browser (safe to edit on the shared API). */
export function isOwned(kind: Kind, id: number): boolean {
  return read(kind).includes(id);
}

export function addOwned(kind: Kind, id: number): void {
  const current = read(kind);
  if (!current.includes(id)) writeStorage(keyFor(kind), [...current, id]);
}
