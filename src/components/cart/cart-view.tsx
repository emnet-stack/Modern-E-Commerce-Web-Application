"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, hydrated, totalItems, subtotal, increase, decrease, removeItem, clearCart } =
    useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading cart">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add a few products and they will show up here."
      >
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </EmptyState>
    );
  }

  function handleCheckout() {
    if (!user) {
      // Guests keep their cart (it is stored in localStorage) and are sent to log in.
      router.push("/login?redirect=%2Fcheckout&reason=checkout");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Shopping cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="divide-y rounded-lg border lg:col-span-2">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
              <Link href={`/products/${item.productId}`} className="shrink-0">
                <SafeImage
                  key={item.image ?? "none"}
                  src={item.image}
                  alt={item.title}
                  className="h-20 w-20 rounded-md sm:h-24 sm:w-24"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.productId}`}
                    className="line-clamp-2 text-sm font-medium hover:underline"
                  >
                    {item.title}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    aria-label={`Remove ${item.title}`}
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} each
                </p>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div
                    className="flex items-center gap-2"
                    role="group"
                    aria-label={`Quantity for ${item.title}`}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                      onClick={() => decrease(item.productId)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium" aria-live="polite">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Increase quantity"
                      onClick={() => increase(item.productId)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside
          aria-labelledby="summary-heading"
          className="h-fit space-y-4 rounded-lg border p-4"
        >
          <h2 id="summary-heading" className="text-lg font-semibold">
            Order summary
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Items</dt>
              <dd>{totalItems}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <Button className="w-full" onClick={handleCheckout} disabled={isLoading}>
            Proceed to checkout
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}