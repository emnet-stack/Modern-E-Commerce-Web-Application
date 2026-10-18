"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Field } from "@/components/shared/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { isEmail, safeRedirect } from "@/lib/validation";

export function LoginForm() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const redirectTo = safeRedirect(params.get("redirect"));
  const reason = params.get("reason");
  const registered = params.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect after a successful login (or if already signed in)
  useEffect(() => {
    if (!isLoading && user) router.replace(redirectTo);
  }, [isLoading, user, redirectTo, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const found: { email?: string; password?: string } = {};
    if (!email.trim()) found.email = "Email is required.";
    else if (!isEmail(email)) found.email = "Enter a valid email address.";
    if (!password) found.password = "Password is required.";
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      // The effect above redirects once the user is set.
    } catch (error) {
      setFormError(
        error instanceof ApiError && error.status === 401
          ? "Invalid email or password."
          : getErrorMessage(error),
      );
      setSubmitting(false);
    }
  }

  const registerHref = `/register${
    params.get("redirect")
      ? `?redirect=${encodeURIComponent(redirectTo)}${reason ? `&reason=${reason}` : ""}`
      : ""
  }`;

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Enter your details to continue.
        </p>
      </div>

      {reason === "checkout" && (
        <Alert>
          <AlertDescription>
            Please log in or create an account to continue to checkout.
          </AlertDescription>
        </Alert>
      )}
      {registered && (
        <Alert>
          <AlertDescription>Account created. Please log in.</AlertDescription>
        </Alert>
      )}
      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field id="email" label="Email" type="email" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Field id="password" label="Password" type="password" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href={registerHref} className="font-medium text-foreground underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}