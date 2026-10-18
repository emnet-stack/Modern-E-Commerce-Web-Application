import type { Metadata } from "next";
import { AdminCategoriesList } from "@/components/admin/admin-categories-list";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return <AdminCategoriesList />;
}