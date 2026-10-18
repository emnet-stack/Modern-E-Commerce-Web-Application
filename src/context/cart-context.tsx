"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { cleanImageUrls } from "@/lib/utils";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "store-cart";

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  increase: (productId: number) => void;
  decrease: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isValidItem(item: unknown): item is CartItem {
  if (typeof item !== "object" || item === null) return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.productId === "number" &&
    typeof i.title === "string" &&
    typeof i.price === "number" &&
    typeof i.quantity === "number" &&
    i.quantity > 0
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load the saved cart after mount (avoids server/client hydration mismatch)
  useEffect(() => {
    const stored = readStorage<unknown>(STORAGE_KEY, []);
    // Loading from localStorage after mount is intentional
    /* eslint-disable react-hooks/set-state-in-effect */
    if (Array.isArray(stored)) setItems(stored.filter(isValidItem));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist on every change, but only after the first load
  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEY, items);
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.productId === product.id);
      if (existing) {
        return current.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: cleanImageUrls(product.images)[0] ?? null,
          quantity,
        },
      ];
    });
  }, []);

  const increase = useCallback((productId: number) => {
    setItems((current) =>
      current.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }, []);

  const decrease = useCallback((productId: number) => {
    setItems((current) =>
      current.map((i) =>
        i.productId === productId && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      addItem,
      increase,
      decrease,
      removeItem,
      clearCart,
    }),
    [items, hydrated, addItem, increase, decrease, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
