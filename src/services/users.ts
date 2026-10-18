import { apiFetch } from "@/lib/api";
import type { User } from "@/types";

export function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users");
}

export function getUser(id: number | string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}