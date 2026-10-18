"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Store,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/users", label: "Users", icon: Users },
];

function SidebarNav({ inSheet }: { inSheet?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const wrap = (node: React.ReactElement, key: string) =>
    inSheet ? (
      <SheetClose asChild key={key}>
        {node}
      </SheetClose>
    ) : (
      <span key={key} className="contents">{node}</span>
    );

  const linkClass = "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent";

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Admin">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return wrap(
          <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(linkClass, active && "bg-accent")}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>,
          href,
        );
      })}
      <div className="mt-auto space-y-1 border-t pt-3">
        {wrap(
          <Link href="/" className={linkClass}>
            <Store className="h-4 w-4" aria-hidden="true" />
            Back to Store
          </Link>,
          "store",
        )}
        {wrap(
          <button type="button" onClick={handleLogout} className={cn(linkClass, "w-full text-left")}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>,
          "logout",
        )}
      </div>
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-60 shrink-0 flex-col gap-4 border-r py-4 md:flex">
        <p className="px-6 text-lg font-semibold">Admin</p>
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open admin menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-4">
                <SheetTitle>Admin</SheetTitle>
                <SheetDescription className="sr-only">Admin navigation</SheetDescription>
              </SheetHeader>
              <div className="flex h-[calc(100%-5rem)] flex-col">
                <SidebarNav inSheet />
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold md:hidden">Admin</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main id="main-content" className="min-w-0 flex-1 space-y-6 p-4 sm:p-6">
          <Alert>
            <AlertDescription>
              Development-only admin access. The administrator role comes from the public demo
              API and is not secure authorization.
            </AlertDescription>
          </Alert>
          {children}
        </main>
      </div>
    </div>
  );
}