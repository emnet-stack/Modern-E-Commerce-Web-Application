"use client";

import Link from "next/link";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { PageHeader, RowsSkeleton } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { isValidProduct } from "@/lib/product-utils";
import { formatPrice } from "@/lib/utils";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import { getUsers } from "@/services/users";

async function loadStats() {
  const [products, categories, users] = await Promise.allSettled([
    getProducts(),
    getCategories(),
    getUsers(),
  ]);
  return {
    products: products.status === "fulfilled" ? products.value.filter(isValidProduct) : null,
    categories: categories.status === "fulfilled" ? categories.value : null,
    users: users.status === "fulfilled" ? users.value : null,
  };
}

export function AdminOverview() {
  const { data, error, isLoading, reload } = useFetch(loadStats);

  if (isLoading) return <RowsSkeleton rows={5} />;
  if (error || !data) {
    return <ErrorState message={error ?? "Could not load dashboard data."} onRetry={reload} />;
  }

  const stats = [
    { label: "Total products", value: data.products?.length },
    { label: "Total categories", value: data.categories?.length },
    { label: "Total users", value: data.users?.length },
  ];

  const recent = [...(data.products ?? [])]
    .sort((a, b) => (Date.parse(b.creationAt) || 0) - (Date.parse(a.creationAt) || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="Live figures calculated from the API." />

      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 text-2xl font-bold">
              {s.value ?? <span className="text-base font-medium text-muted-foreground">Unavailable</span>}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="quick-links" className="space-y-3">
        <h2 id="quick-links" className="text-lg font-semibold">Quick links</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline"><Link href="/admin/products">Manage products</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/categories">Manage categories</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/users">View users</Link></Button>
          <Button asChild><Link href="/admin/products/new">New product</Link></Button>
        </div>
      </section>

      <section aria-labelledby="recent-products" className="space-y-3">
        <h2 id="recent-products" className="text-lg font-semibold">Recently available products</h2>
        {data.products === null ? (
          <ErrorState message="Products are currently unavailable." onRetry={reload} />
        ) : recent.length === 0 ? (
          <EmptyState title="No products yet" />
        ) : (
          <ul className="divide-y rounded-lg border">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                <Link href={`/admin/products/${p.id}`} className="min-w-0 truncate font-medium hover:underline">
                  {p.title}
                </Link>
                <span className="shrink-0 text-muted-foreground">{formatPrice(p.price)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}