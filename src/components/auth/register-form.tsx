"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Field } from "@/components/shared/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";
import { isEmail, safeRedirect } from "@/lib/validation";
import { isEmailAvailable, register } from "@/services/auth";

interface Values {
  name: string;
  email: string;
  password: string;
  confirm: string;
}
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Enter your name.";
  if (!isEmail(v.email)) errors.email = "Enter a valid email address.";
  if (v.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (v.confirm !== v.password) errors.confirm = "Passwords do not match.";
  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawRedirect = params.get("redirect");

  const [values, setValues] = useState<Values>({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const found = validate(values);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const available = await isEmailAvailable(values.email.trim());
      if (!available) {
        setErrors({ email: "This email is already registered. Try logging in." });
        setSubmitting(false);
        return;
      }

      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      const next = new URLSearchParams({ registered: "1" });
      if (rawRedirect) next.set("redirect", safeRedirect(rawRedirect));
      router.push(`/login?${next.toString()}`);
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Register to check out and manage your profile.
        </p>
      </div>

      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field id="name" label="Name" autoComplete="name"
          value={values.name} onChange={set("name")} error={errors.name} />
        <Field id="email" label="Email" type="email" autoComplete="email"
          value={values.email} onChange={set("email")} error={errors.email} />
        <Field id="password" label="Password" type="password" autoComplete="new-password"
          hint="At least 6 characters. Letters and numbers work best with this API."
          value={values.password} onChange={set("password")} error={errors.password} />
        <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password"
          value={values.confirm} onChange={set("confirm")} error={errors.confirm} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Log in
        </Link>
      </p>
    </div>
  );
}