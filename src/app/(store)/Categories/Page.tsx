import type { Metadata } from "next";
import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { EmptyState } from "@/components/shared/states";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/catalog";
import { cleanImageUrls } from "@/lib/utils";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse products by category.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [allCategories, allProducts] = await Promise.all([
    getCategories(),
    getProducts().catch(() => null),
  ]);

  const valid = allCategories.filter(
    (c) => c && typeof c.slug === "string" && c.name,
  );

  const categories = allProducts
    ? getStorefrontCategories(valid, getStorefrontProducts(allProducts))
    : valid;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      {categories.length === 0 ? (
        <EmptyState title="No categories available" />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/categories/${c.slug}`}
                className="block overflow-hidden rounded-lg border outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <SafeImage
                  key={c.image}
                  src={cleanImageUrls([c.image])[0]}
                  alt={c.name}
                  className="aspect-video w-full"
                />
                <p className="p-3 font-medium">{c.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
