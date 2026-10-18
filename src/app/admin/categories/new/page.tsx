import type { Metadata } from "next";
import { CategoryFormPage } from "@/components/admin/category-form";

export const metadata: Metadata = { title: "New category" };

export default function NewCategoryPage() {
  return <CategoryFormPage />;
}