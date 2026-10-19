import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import { SafeImage } from "@/components/shared/safe-image";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/catalog";
import { cleanImageUrls } from "@/lib/utils";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [productsResult, categoriesResult] = await Promise.allSettled([
    getProducts(),
    getCategories(),
  ]);

  const products =
    productsResult.status === "fulfilled"
      ? getStorefrontProducts(productsResult.value)
      : null;

  const categories =
    categoriesResult.status === "fulfilled" && products
      ? getStorefrontCategories(categoriesResult.value, products).slice(0, 6)
      : null;

  const featured = products
    ? [...products].sort((a, b) => a.id - b.id).slice(0, 8)
    : null;

  return (
    <div className="space-y-10">
      <section className="space-y-4 py-6 sm:py-10">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Quality products, simple shopping.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Browse our catalog, find what you need with search and filters, and
          check out in a few steps.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/products">Browse all products</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/categories">Browse categories</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="categories-heading" className="text-xl font-semibold">
            Shop by category
          </h2>
          <Link href="/categories" className="text-sm underline">
            View all
          </Link>
        </div>
        {categories === null ? (
          <ErrorState message="Categories could not be loaded right now. Refresh the page to try again." />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories available" />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
                  <p className="truncate p-2 text-sm font-medium">{c.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="featured-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="featured-heading" className="text-xl font-semibold">
            Featured products
          </h2>
          <Link href="/products" className="text-sm underline">
            View all
          </Link>
        </div>
        {featured === null ? (
          <ErrorState message="Products could not be loaded right now. Refresh the page to try again." />
        ) : featured.length === 0 ? (
          <EmptyState title="No products available yet" />
        ) : (
          <ProductGrid products={featured} />
        )}
      </section>
    </div>
  );
}
