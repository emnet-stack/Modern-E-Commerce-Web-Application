"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader, RowsSkeleton } from "@/components/admin/admin-ui";
import { SafeImage } from "@/components/shared/safe-image";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import { isValidProduct } from "@/lib/product-utils";
import { cleanImageUrls, formatPrice } from "@/lib/utils";
import { getProducts } from "@/services/products";

const PAGE_SIZE = 20;

export function AdminProductsList() {
  const { data, error, isLoading, reload } = useFetch(getProducts);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? [])
      .filter(isValidProduct)
      .filter((p) => !q || p.title.toLowerCase().includes(q));
  }, [data, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="View and manage products from the API."
        action={
          <Button asChild>
            <Link href="/admin/products/new">New product</Link>
          </Button>
        }
      />

      <div className="max-w-sm space-y-2">
        <Label htmlFor="admin-product-search">Search products</Label>
        <Input
          id="admin-product-search"
          type="search"
          placeholder="Search by title"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisible(PAGE_SIZE);
          }}
        />
      </div>

      {isLoading ? (
        <RowsSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "No products match your search" : "No products found"}
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-16 sm:table-cell">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, visible).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="hidden sm:table-cell">
                    <SafeImage
                      key={p.id}
                      src={cleanImageUrls(p.images)[0]}
                      alt={p.title}
                      className="h-10 w-10 rounded"
                    />
                  </TableCell>
                  <TableCell className="max-w-[10rem] truncate font-medium sm:max-w-xs">
                    <Link href={`/admin/products/${p.id}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{p.category?.name ?? "None"}</TableCell>
                  <TableCell>{formatPrice(p.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/products/${p.id}`}>View</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length > visible && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Show more ({filtered.length - visible} left)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}