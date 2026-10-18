import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery details to place a simulated order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <RequireAuth reason="checkout">
      <CheckoutForm />
    </RequireAuth>
  );
}