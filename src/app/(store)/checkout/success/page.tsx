import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { OrderConfirmation } from "@/components/cart/order-confirmation";

export const metadata: Metadata = {
  title: "Order confirmation",
  description: "Your simulated order summary.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <RequireAuth reason="checkout">
      <OrderConfirmation />
    </RequireAuth>
  );
}