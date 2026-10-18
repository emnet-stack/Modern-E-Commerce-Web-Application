import type { Metadata } from "next";
import { CategoryFormPage } from "@/components/admin/category-form";

export const metadata: Metadata = { title: "Edit category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CategoryFormPage key={id} id={id} />;
}