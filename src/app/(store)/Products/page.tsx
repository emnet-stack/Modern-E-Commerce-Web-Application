import type { Metadata } from "next";
import { ProductsView } from "@/components/products/products-view";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/catalog";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse, search, filter and sort all products.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [allProducts, allCategories] = await Promise.all([
    getProducts(),
    getCategories().catch(() => []),
  ]);

  const products = getStorefrontProducts(allProducts);
  const categories = getStorefrontCategories(allCategories, products);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <ProductsView products={products} categories={categories} />
    </div>
  );
}
