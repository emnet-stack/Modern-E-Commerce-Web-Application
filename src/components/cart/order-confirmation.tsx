"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/states";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { readLastOrder } from "@/lib/order";
import { formatDate, formatPrice } from "@/lib/utils";
import type { SimulatedOrder } from "@/types";

export function OrderConfirmation() {
  const [order, setOrder] = useState<SimulatedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(readLastOrder());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!order) {
    return (
      <EmptyState
        title="No recent order found"
        description="There is no simulated order to show. Start by adding products to your cart."
      >
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Order received (simulated)</h1>
        <p className="text-muted-foreground">
          Thank you, {order.customer.fullName}. Your simulated order was recorded on{" "}
          {formatDate(order.placedAt)}.
        </p>
      </div>

      <Alert>
        <AlertTitle>Demo only</AlertTitle>
        <AlertDescription>
          No payment was taken, nothing will be shipped, and no real order was created.
        </AlertDescription>
      </Alert>

      <section aria-labelledby="order-items" className="space-y-3 rounded-lg border p-4">
        <h2 id="order-items" className="text-lg font-semibold">
          Order summary
        </h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span className="shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between border-t pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </p>
      </section>

      <section aria-labelledby="order-delivery" className="space-y-1 rounded-lg border p-4 text-sm">
        <h2 id="order-delivery" className="text-lg font-semibold">
          Delivery details
        </h2>
        <p>{order.customer.fullName}</p>
        <p>{order.customer.address}</p>
        <p>{order.customer.city}</p>
        <p>{order.customer.phone}</p>
        <p>{order.customer.email}</p>
      </section>

      <Button asChild>
        <Link href="/products">Continue shopping</Link>
      </Button>
    </div>
  );
}