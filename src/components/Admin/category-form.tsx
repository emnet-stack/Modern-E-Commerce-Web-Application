"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageHeader, RowsSkeleton } from "@/components/admin/admin-ui";
import { Field } from "@/components/shared/field";
import { ErrorState } from "@/components/shared/states";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFetch } from "@/hooks/use-fetch";
import { formatDate, getErrorMessage } from "@/lib/utils";
import { isHttpUrl } from "@/lib/validation";
import { createCategory, getCategory, updateCategory } from "@/services/categories";
import type { Category } from "@/types";
import { addOwned, isOwned } from "@/lib/owned";

type Errors = { name?: string; image?: string; confirm?: string };

function CategoryForm({ category }: { category: Category | null }) {
  const router = useRouter();
  const isEdit = category !== null;

  const [name, setName] = useState(category?.name ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const found: Errors = {};
    if (name.trim().length < 2) found.name = "Name must be at least 2 characters.";
    if (!isHttpUrl(image)) found.image = "Enter a valid http(s) image URL.";
    if (isEdit && !confirmed) found.confirm = "Confirm that this is a record you created for testing.";
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const input = { name: name.trim(), image: image.trim() };
    try {
            if (isEdit) {
        await updateCategory(category.id, input);
      } else {
        const created = await createCategory(input);
        addOwned("categories", created.id);
      }
      router.push("/admin/categories");
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }

  }
  if (isEdit && !isOwned("categories", category.id)) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            This is a shared category you did not create in this browser, so editing is disabled
            to protect other students. Create your own test category to try editing.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/admin/categories">Back to categories</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit category" : "New category"}
        action={<Button asChild variant="outline"><Link href="/admin/categories">Cancel</Link></Button>}
      />

      {isEdit && (
        <dl className="grid max-w-2xl gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">ID</dt><dd>{category.id}</dd></div>
          <div><dt className="text-muted-foreground">Slug</dt><dd>{category.slug}</dd></div>
          <div><dt className="text-muted-foreground">Created</dt><dd>{formatDate(category.creationAt)}</dd></div>
          <div><dt className="text-muted-foreground">Updated</dt><dd>{formatDate(category.updatedAt)}</dd></div>
        </dl>
      )}

      <Alert>
        <AlertDescription>
          This is a shared public API. {isEdit ? "Only edit categories you created for testing." : "Use a clear test name for new categories."}
        </AlertDescription>
      </Alert>

      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-4">
        <Field id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Field id="image" label="Image URL" type="url" value={image}
          onChange={(e) => setImage(e.target.value)} error={errors.image} />

        {isEdit && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <input id="confirm-edit" type="checkbox" className="mt-1 h-4 w-4"
                checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              <Label htmlFor="confirm-edit" className="font-normal">
                I confirm this is a test category I created, not a shared one other students may depend on.
              </Label>
            </div>
            {errors.confirm && <p role="alert" className="text-sm text-destructive">{errors.confirm}</p>}
          </div>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create category"}
        </Button>
      </form>
    </div>
  );
}

export function CategoryFormPage({ id }: { id?: string }) {
  const { data, error, isLoading, reload } = useFetch(async () => (id ? getCategory(id) : null));

  if (isLoading) return <RowsSkeleton rows={3} />;
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorState title="Could not load the category" message={error} onRetry={reload} />
        <Button asChild variant="outline"><Link href="/admin/categories">Back to categories</Link></Button>
      </div>
    );
  }
  return <CategoryForm category={data} />;
}