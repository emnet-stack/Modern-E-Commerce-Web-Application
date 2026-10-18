import { apiFetch } from "@/lib/api";
import type { Product, ProductInput } from "@/types";

export function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products");
}

export function getProduct(id: number | string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export function getProductBySlug(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/slug/${slug}`);
}

export function getRelatedProducts(id: number | string): Promise<Product[]> {
  return apiFetch<Product[]>(`/products/${id}/related`);
}

export function createProduct(input: ProductInput): Promise<Product> {
  return apiFetch<Product>("/products", { method: "POST", body: input });
}

export function updateProduct(
  id: number | string,
  input: Partial<ProductInput>,
): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { method: "PUT", body: input });
}