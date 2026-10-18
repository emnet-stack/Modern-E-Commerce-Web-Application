"use client";

import Link from "next/link";
import { PageHeader, RowsSkeleton } from "@/components/admin/admin-ui";
import { SafeImage } from "@/components/shared/safe-image";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import { cleanImageUrls } from "@/lib/utils";
import { getCategories } from "@/services/categories";

export function AdminCategoriesList() {
  const { data, error, isLoading, reload } = useFetch(getCategories);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="View and manage categories from the API."
        action={<Button asChild><Link href="/admin/categories/new">New category</Link></Button>}
      />

      {isLoading ? (
        <RowsSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No categories found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-16 sm:table-cell">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden sm:table-cell">ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="hidden sm:table-cell">
                  <SafeImage key={c.image} src={cleanImageUrls([c.image])[0]} alt={c.name} className="h-10 w-10 rounded" />
                </TableCell>
                <TableCell className="max-w-[10rem] truncate font-medium sm:max-w-xs">{c.name}</TableCell>
                <TableCell className="hidden md:table-cell">{c.slug}</TableCell>
                <TableCell className="hidden sm:table-cell">{c.id}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/categories/${c.id}/edit`}>View / Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}