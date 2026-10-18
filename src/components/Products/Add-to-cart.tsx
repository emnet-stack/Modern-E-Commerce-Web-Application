"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2" role="group" aria-label="Quantity">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button type="button" onClick={handleAdd}>
          Add to cart
        </Button>
      </div>
      {added && (
        <p className="text-sm text-muted-foreground" role="status">
          Added to your cart.{" "}
          <Link href="/cart" className="underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}