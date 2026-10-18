"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Field } from "@/components/shared/field";
import { EmptyState } from "@/components/shared/states";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { saveLastOrder } from "@/lib/order";
import { formatPrice } from "@/lib/utils";
import { isEmail, isPhone } from "@/lib/validation";
import type { CheckoutFormData } from "@/types";

type Errors = Partial<Record<keyof CheckoutFormData, string>>;

function validate(values: CheckoutFormData): Errors {
  const errors: Errors = {};
  if (values.fullName.trim().length < 2) errors.fullName = "Enter your full name.";
  if (!isEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!isPhone(values.phone)) errors.phone = "Enter a valid phone number.";
  if (values.address.trim().length < 5) errors.address = "Enter your delivery address.";
  if (values.city.trim().length < 2) errors.city = "Enter your city.";
  return errors;
}

export function CheckoutForm() {
  const { user } = useAuth();
  const { items, hydrated, subtotal, totalItems, clearCart } = useCart();
  const router = useRouter();

  const [values, setValues] = useState<CheckoutFormData>({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const set =
    (key: keyof CheckoutFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  if (!hydrated) return null;

  if (items.length === 0 && !submitting) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some products before checking out."
      >
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </EmptyState>
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    saveLastOrder({
      items,
      total: subtotal,
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
      },
      placedAt: new Date().toISOString(),
    });
    clearCart();
    router.push("/checkout/success");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <Alert>
        <AlertDescription>
          This is a simulated checkout. No payment is taken and no real order is created.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-lg border p-4 sm:p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold">Delivery information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="fullName" label="Full name" autoComplete="name"
              value={values.fullName} onChange={set("fullName")} error={errors.fullName} />
            <Field id="email" label="Email" type="email" autoComplete="email"
              value={values.email} onChange={set("email")} error={errors.email} />
            <Field id="phone" label="Phone number" type="tel" autoComplete="tel"
              value={values.phone} onChange={set("phone")} error={errors.phone} />
            <Field id="city" label="City" autoComplete="address-level2"
              value={values.city} onChange={set("city")} error={errors.city} />
          </div>
          <Field id="address" label="Delivery address" autoComplete="street-address"
            value={values.address} onChange={set("address")} error={errors.address} />
          <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? "Placing order..." : "Place order"}
          </Button>
        </form>

        <aside
          aria-labelledby="checkout-summary"
          className="h-fit space-y-4 rounded-lg border p-4"
        >
          <h2 id="checkout-summary" className="text-lg font-semibold">
            Order summary
          </h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="line-clamp-2">
                  {item.title} × {item.quantity}
                </span>
                <span className="shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}