"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader, RowsSkeleton } from "@/components/admin/admin-ui";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import { formatDate, getInitials } from "@/lib/utils";
import { getUser, getUsers } from "@/services/users";

export function AdminUsersList() {
  const { data, error, isLoading, reload } = useFetch(getUsers);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (u) => !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Read-only user information, where the API permits it." />

      <div className="max-w-sm space-y-2">
        <Label htmlFor="user-search">Search by name or email</Label>
        <Input id="user-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <RowsSkeleton />
      ) : error ? (
        <ErrorState
          title="User information is unavailable"
          message={`${error} The API may not permit listing users.`}
          onRetry={reload}
        />
      ) : filtered.length === 0 ? (
        <EmptyState title={search ? "No users match your search" : "No users found"} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar} alt="" />
                      <AvatarFallback>{getInitials(u.name ?? "")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="max-w-[9rem] truncate font-medium sm:max-w-xs">{u.name}</p>
                      <p className="max-w-[9rem] truncate text-xs text-muted-foreground md:hidden">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{u.email}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary" className="capitalize">{u.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${u.id}`}>View</Link>
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

export function AdminUserDetail({ id }: { id: string }) {
  const { data: user, error, isLoading, reload } = useFetch(() => getUser(id));

  if (isLoading) return <RowsSkeleton rows={3} />;
  if (error || !user) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="User could not be loaded"
          message={`${error ?? "User not found."} The API may not permit access to this resource.`}
          onRetry={reload}
        />
        <Button asChild variant="outline"><Link href="/admin/users">Back to users</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.name}
        action={<Button asChild variant="outline"><Link href="/admin/users">Back to users</Link></Button>}
      />
      <div className="max-w-xl space-y-4 rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={`${user.name} avatar`} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">ID</dt><dd>{user.id}</dd></div>
          <div><dt className="text-muted-foreground">Role</dt><dd className="capitalize">{user.role}</dd></div>
          <div><dt className="text-muted-foreground">Created</dt><dd>{formatDate(user.creationAt)}</dd></div>
          <div><dt className="text-muted-foreground">Updated</dt><dd>{formatDate(user.updatedAt)}</dd></div>
        </dl>
      </div>
    </div>
  );
}