import type { Metadata } from "next";
import Link from "next/link";
import { AddToCart } from "@/components/products/add-to-cart";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductGrid } from "@/components/products/product-grid";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { isValidProduct, truncate } from "@/lib/product-utils";
import { cleanImageUrls, formatPrice } from "@/lib/utils";
import { getProduct, getRelatedProducts } from "@/services/products";
import type { Product } from "@/types";

type Props = { params: Promise<{ id: string }> };

// Returns null when the product doesn't exist; other errors bubble up to error.tsx
async function loadProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProduct(id);
    return isValidProduct(product) ? product : null;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await loadProduct(id);
    if (!product) return { title: "Product not found" };
    return {
      title: product.title,
      description: truncate(product.description ?? ""),
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product doesn't exist or is no longer available."
      >
        <Button asChild>
          <Link href="/products">Back to products</Link>
        </Button>
      </EmptyState>
    );
  }

  const related = (await getRelatedProducts(product.id).catch(() => []))
    .filter(isValidProduct)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-10">
      <Link href="/products" className="text-sm text-muted-foreground underline">
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery
          images={cleanImageUrls(product.images)}
          title={product.title}
        />
        <div className="space-y-4">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-sm text-muted-foreground underline"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground">
            {product.description || "No description available."}
          </p>
          <AddToCart product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-4">
          <h2 id="related-heading" className="text-xl font-semibold">
            Related products
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}