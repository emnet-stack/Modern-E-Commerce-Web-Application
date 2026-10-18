import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { isValidProduct } from "@/lib/product-utils";
import { getCategoryBySlug, getProductsByCategory } from "@/services/categories";
import type { Category } from "@/types";

type Props = { params: Promise<{ slug: string }> };

async function loadCategory(slug: string): Promise<Category | null> {
  try {
    return await getCategoryBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await loadCategory(slug);
    if (!category) return { title: "Category not found" };
    return {
      title: category.name,
      description: `Browse ${category.name} products.`,
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await loadCategory(slug);

  if (!category) {
    return (
      <EmptyState
        title="Category not found"
        description="This category doesn't exist or is no longer available."
      >
        <Button asChild>
          <Link href="/categories">Back to categories</Link>
        </Button>
      </EmptyState>
    );
  }

  const products = (await getProductsByCategory(category.id)).filter(
    isValidProduct,
  );

  return (
    <div className="space-y-6">
      <Link href="/categories" className="text-sm text-muted-foreground underline">
        ← All categories
      </Link>
      <h1 className="text-2xl font-bold">{category.name}</h1>
      {products.length === 0 ? (
        <EmptyState
          title="No products in this category"
          description="Check back later or browse other categories."
        >
          <Button asChild variant="outline">
            <Link href="/products">Browse all products</Link>
          </Button>
        </EmptyState>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}