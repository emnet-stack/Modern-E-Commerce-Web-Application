"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/states";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Product } from "@/types";

type SortKey = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
const PAGE_SIZE = 12;

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted.sort(
        (a, b) =>
          (Date.parse(b.creationAt) || 0) - (Date.parse(a.creationAt) || 0),
      );
  }
}

export function ProductsView({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Categories come from the API; fall back to the products' own categories
  const categoryOptions = useMemo(() => {
    if (categories.length) {
      return categories.map((c) => ({ id: c.id, name: c.name }));
    }
    const map = new Map<number, string>();
    products.forEach((p) => p.category && map.set(p.category.id, p.category.name));
    return [...map].map(([id, name]) => ({ id, name }));
  }, [categories, products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const list = products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (categoryId !== "all" && String(p.category?.id) !== categoryId)
        return false;
      if (min !== null && !Number.isNaN(min) && p.price < min) return false;
      if (max !== null && !Number.isNaN(max) && p.price > max) return false;
      return true;
    });
    return sortProducts(list, sort);
  }, [products, search, categoryId, minPrice, maxPrice, sort]);

  const hasFilters =
    search !== "" || categoryId !== "all" || minPrice !== "" || maxPrice !== "";

  function clearFilters() {
    setSearch("");
    setCategoryId("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setVisible(PAGE_SIZE);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="space-y-2 sm:col-span-2 lg:col-span-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="search"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisible(PAGE_SIZE);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={categoryId}
            onValueChange={(v) => {
              setCategoryId(v);
              setVisible(PAGE_SIZE);
            }}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
          <div className="space-y-2">
            <Label htmlFor="min-price">Min price</Label>
            <Input
              id="min-price"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setVisible(PAGE_SIZE);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-price">Max price</Label>
            <Input
              id="max-price"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setVisible(PAGE_SIZE);
              }}
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="sort">Sort by</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger id="sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No products available"
          description="The store has no products to show right now. Please check back later."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products match your search"
          description="Try a different search term, category or price range."
        >
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <>
          <ProductGrid products={filtered.slice(0, visible)} />
          {filtered.length > visible && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Show more ({filtered.length - visible} left)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}