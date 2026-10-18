"use client";

import Link from "next/link";
import { PageHeader, RowsSkeleton } from "@/components/admin/admin-ui";
import { SafeImage } from "@/components/shared/safe-image";
import { ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { cleanImageUrls, formatDate, formatPrice } from "@/lib/utils";
import { getProduct } from "@/services/products";

export function AdminProductDetail({ id }: { id: string }) {
  const { data: product, error, isLoading, reload } = useFetch(() => getProduct(id));

  if (isLoading) return <RowsSkeleton rows={4} />;
  if (error || !product) {
    return (
      <div className="space-y-4">
        <ErrorState title="Product could not be loaded" message={error ?? "Product not found."} onRetry={reload} />
        <Button asChild variant="outline"><Link href="/admin/products">Back to products</Link></Button>
      </div>
    );
  }

  const images = cleanImageUrls(product.images);

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.title}
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link href="/admin/products">Back</Link></Button>
            <Button asChild variant="outline"><Link href={`/products/${product.id}`}>View in store</Link></Button>
            <Button asChild><Link href={`/admin/products/${product.id}/edit`}>Edit</Link></Button>
          </div>
        }
      />

      <dl className="grid max-w-2xl gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
        <div><dt className="text-muted-foreground">ID</dt><dd>{product.id}</dd></div>
        <div><dt className="text-muted-foreground">Price</dt><dd>{formatPrice(product.price)}</dd></div>
        <div><dt className="text-muted-foreground">Category</dt><dd>{product.category?.name ?? "None"}</dd></div>
        <div><dt className="text-muted-foreground">Slug</dt><dd>{product.slug}</dd></div>
        <div><dt className="text-muted-foreground">Created</dt><dd>{formatDate(product.creationAt)}</dd></div>
        <div><dt className="text-muted-foreground">Updated</dt><dd>{formatDate(product.updatedAt)}</dd></div>
        <div className="sm:col-span-2"><dt className="text-muted-foreground">Description</dt><dd>{product.description || "No description."}</dd></div>
      </dl>

      <section aria-labelledby="product-images" className="space-y-3">
        <h2 id="product-images" className="text-lg font-semibold">Images</h2>
        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground">No valid images available.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((src) => (
              <li key={src}>
                <SafeImage key={src} src={src} alt={product.title} className="aspect-square w-full rounded-lg border" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}