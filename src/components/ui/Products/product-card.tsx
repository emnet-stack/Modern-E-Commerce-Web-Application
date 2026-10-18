import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { cleanImageUrls, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const image = cleanImageUrls(product.images)[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block h-full overflow-hidden rounded-lg border bg-card text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <SafeImage
          key={image}
          src={image}
          alt={product.title}
          className="h-full w-full"
        />
      </div>
      <div className="space-y-1 p-3">
        <p className="text-xs text-muted-foreground">
          {product.category?.name ?? "Uncategorized"}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium group-hover:underline">
          {product.title}
        </h3>
        <p className="font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}