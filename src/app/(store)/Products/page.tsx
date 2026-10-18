import type { Metadata } from "next";
import { ProductsView } from "@/components/products/products-view";
import { isValidProduct } from "@/lib/product-utils";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse, search, filter and sort all products.",
};

export default async function ProductsPage() {
  // If products fail, the (store)/error.tsx boundary shows a retry state.
  // Categories failing should not block the product list.
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <ProductsView
        products={products.filter(isValidProduct)}
        categories={categories}
      />
    </div>
  );
}