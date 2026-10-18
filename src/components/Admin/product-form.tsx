"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageHeader, RowsSkeleton } from "@/components/admin/admin-ui";
import { Field, TextareaField } from "@/components/shared/field";
import { ErrorState } from "@/components/shared/states";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/use-fetch";
import { cleanImageUrls, getErrorMessage } from "@/lib/utils";
import { isHttpUrl } from "@/lib/validation";
import { getCategories } from "@/services/categories";
import { createProduct, getProduct, updateProduct } from "@/services/products";
import type { Category, Product } from "@/types";

interface Values {
  title: string;
  price: string;
  description: string;
  categoryId: string;
  images: string;
}
type Errors = Partial<Record<keyof Values | "confirm", string>>;

function parseImages(text: string): string[] {
  return text.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

function validate(v: Values, isEdit: boolean, confirmed: boolean): Errors {
  const errors: Errors = {};
  const price = Number(v.price);
  const urls = parseImages(v.images);

  if (v.title.trim().length < 3) errors.title = "Title must be at least 3 characters.";
  if (v.price.trim() === "" || Number.isNaN(price) || price <= 0)
    errors.price = "Enter a price greater than 0.";
  if (v.description.trim().length < 10)
    errors.description = "Description must be at least 10 characters.";
  if (!v.categoryId) errors.categoryId = "Select a category.";
  if (urls.length === 0) errors.images = "Add at least one image URL.";
  else if (urls.some((u) => !isHttpUrl(u)))
    errors.images = "Every image must be a valid http(s) URL, one per line.";
  if (isEdit && !confirmed)
    errors.confirm = "Confirm that this is a record you created for testing.";
  return errors;
}

function ProductForm({ categories, product }: { categories: Category[]; product: Product | null }) {
  const router = useRouter();
  const isEdit = product !== null;

  const [values, setValues] = useState<Values>({
    title: product?.title ?? "",
    price: product ? String(product.price) : "",
    description: product?.description ?? "",
    categoryId: product?.category?.id ? String(product.category.id) : "",
    images: cleanImageUrls(product?.images).join("\n"),
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const found = validate(values, isEdit, confirmed);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const input = {
      title: values.title.trim(),
      price: Number(values.price),
      description: values.description.trim(),
      categoryId: Number(values.categoryId),
      images: parseImages(values.images),
    };

    try {
      const saved = isEdit ? await updateProduct(product.id, input) : await createProduct(input);
      router.push(`/admin/products/${saved.id}`);
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit product" : "New product"}
        action={
          <Button asChild variant="outline">
            <Link href={isEdit ? `/admin/products/${product.id}` : "/admin/products"}>Cancel</Link>
          </Button>
        }
      />

      <Alert>
        <AlertDescription>
          This is a shared public API. {isEdit ? "Only edit records you created for testing." : "Records you create are visible to everyone. Use a clear test title."}
        </AlertDescription>
      </Alert>

      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-4">
        <Field id="title" label="Title" value={values.title}
          onChange={(e) => set("title")(e.target.value)} error={errors.title} />
        <Field id="price" label="Price" type="number" min="0" step="0.01" value={values.price}
          onChange={(e) => set("price")(e.target.value)} error={errors.price} />
        <TextareaField id="description" label="Description" rows={4} value={values.description}
          onChange={(e) => set("description")(e.target.value)} error={errors.description} />

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select value={values.categoryId} onValueChange={set("categoryId")}>
            <SelectTrigger id="categoryId" className="w-full" aria-invalid={!!errors.categoryId}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p role="alert" className="text-sm text-destructive">{errors.categoryId}</p>
          )}
        </div>

        <TextareaField id="images" label="Image URLs" rows={3}
          hint="One URL per line (http or https)."
          value={values.images} onChange={(e) => set("images")(e.target.value)} error={errors.images} />

        {isEdit && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <input id="confirm-edit" type="checkbox" className="mt-1 h-4 w-4"
                checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              <Label htmlFor="confirm-edit" className="font-normal">
                I confirm this is a test record I created, not a shared product other students may depend on.
              </Label>
            </div>
            {errors.confirm && (
              <p role="alert" className="text-sm text-destructive">{errors.confirm}</p>
            )}
          </div>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </Button>
      </form>
    </div>
  );
}

export function ProductFormPage({ id }: { id?: string }) {
  const { data, error, isLoading, reload } = useFetch(async () => {
    const [categories, product] = await Promise.all([
      getCategories(),
      id ? getProduct(id) : Promise.resolve(null),
    ]);
    return { categories, product };
  });

  if (isLoading) return <RowsSkeleton rows={5} />;
  if (error || !data) {
    return <ErrorState title="Could not load the form" message={error ?? "Unknown error."} onRetry={reload} />;
  }
  return <ProductForm categories={data.categories} product={data.product} />;
}