import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Modern Store. Demo project: orders are simulated.</p>
        <nav className="flex gap-4" aria-label="Footer">
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <Link href="/categories" className="hover:text-foreground">Categories</Link>
          <Link href="/cart" className="hover:text-foreground">Cart</Link>
        </nav>
      </div>
    </footer>
  );
}