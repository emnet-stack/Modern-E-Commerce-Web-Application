import { apiFetch } from "@/lib/api";
import type { Category, CategoryInput, Product } from "@/types";

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export function getCategory(id: number | string): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`);
}

export function getCategoryBySlug(slug: string): Promise<Category> {
  return apiFetch<Category>(`/categories/slug/${slug}`);
}

export function getProductsByCategory(id: number | string): Promise<Product[]> {
  return apiFetch<Product[]>(`/categories/${id}/products`);
}

export function createCategory(input: CategoryInput): Promise<Category> {
  return apiFetch<Category>("/categories", { method: "POST", body: input });
}

export function updateCategory(
  id: number | string,
  input: Partial<CategoryInput>,
): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: "PUT",
    body: input,
  });
}