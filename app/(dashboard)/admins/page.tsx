"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Shield,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdmins, useDeleteAdmin } from "@/hooks/useAdmin";
import { useAdminStore } from "@/store/admin.store";
import { RequireSuperAdmin } from "@/components/auth/require-auth";
import { CreateAdminDialog } from "@/components/create-admin-dialog";
import { EditAdminDialog } from "@/components/edit-admin-dialog";
import type { Admin } from "@/types/admin.types";

function AdminsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const { data: admins = [], isLoading } = useAdmins();
  const deleteAdmin = useDeleteAdmin();
  const { admin: currentAdmin } = useAdminStore();

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to deactivate this admin?")) {
      deleteAdmin.mutate(id);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6 bg-background">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Admin Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage admin accounts and their access permissions.
          </p>
        </div>
        <Button
          className="gap-2 w-fit"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Admins Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredAdmins.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Businesses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {getInitials(admin.firstName, admin.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {admin.firstName} {admin.lastName}
                        </span>
                        {admin._id === currentAdmin?._id && (
                          <span className="text-xs text-muted-foreground">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell>
                    {admin.role === "super-admin" ? (
                      <Badge variant="default" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <User className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {admin.role === "super-admin"
                        ? "All"
                        : admin.businessIds?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {admin.isActive ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={admin._id === currentAdmin?._id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingAdmin(admin)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(admin._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <User className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No admins found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "No admins match your search criteria."
              : "Get started by adding your first admin."}
          </p>
          {!searchQuery && (
            <Button
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          )}
        </div>
      )}

      {/* Create Admin Dialog */}
      <CreateAdminDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* Edit Admin Dialog */}
      {editingAdmin && (
        <EditAdminDialog
          admin={editingAdmin}
          open={!!editingAdmin}
          onOpenChange={(open) => !open && setEditingAdmin(null)}
        />
      )}
    </div>
  );
}

export default function AdminsPage() {
  return (
    <RequireSuperAdmin
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminsPageContent />
    </RequireSuperAdmin>
  );
}
