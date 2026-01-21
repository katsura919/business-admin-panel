"use client";

import { useState } from "react";
import {
  Search,
  Shield,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdmins, useUpdateAdmin, useDeleteAdmin } from "@/hooks/useAdmin";
import { useBusinesses } from "@/hooks/useBusiness";
import { useAdminStore } from "@/store/admin.store";
import type { Admin, AdminRole } from "@/types/admin.types";

export default function ManageAdminsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<AdminRole>("admin");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editBusinessIds, setEditBusinessIds] = useState<string[]>([]);

  const { data: admins = [], isLoading: isLoadingAdmins } = useAdmins();
  const { data: businesses = [], isLoading: isLoadingBusinesses } =
    useBusinesses();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const { admin: currentAdmin } = useAdminStore();

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  const handleSelectAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditFirstName(admin.firstName);
    setEditLastName(admin.lastName);
    setEditEmail(admin.email);
    setEditRole(admin.role);
    setEditIsActive(admin.isActive);
    setEditBusinessIds(admin.businessIds || []);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    updateAdmin.mutate(
      {
        id: selectedAdmin._id,
        data: {
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
          role: editRole,
          isActive: editIsActive,
          businessIds: editRole === "admin" ? editBusinessIds : [],
        },
      },
      {
        onSuccess: (updated) => {
          setSelectedAdmin(updated);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
      },
    );
  };

  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return;
    if (confirm("Are you sure you want to deactivate this admin?")) {
      deleteAdmin.mutate(selectedAdmin._id, {
        onSuccess: () => {
          setSelectedAdmin(null);
        },
      });
    }
  };

  const toggleBusinessSelection = (businessId: string) => {
    setEditBusinessIds((prev) =>
      prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId],
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Admins</h1>
        <p className="text-muted-foreground">
          View, edit, and manage administrator accounts and their permissions.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <CheckCircle2 className="h-5 w-5" />
          <span>Admin updated successfully!</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Admin List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administrators
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingAdmins ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>No admins found.</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                {filteredAdmins.map((admin) => (
                  <button
                    key={admin._id}
                    onClick={() => handleSelectAdmin(admin)}
                    disabled={admin._id === currentAdmin?._id}
                    className={`w-full flex items-center gap-3 border-b p-3 last:border-b-0 text-left transition-colors
                                            ${
                                              selectedAdmin?._id === admin._id
                                                ? "bg-primary/10"
                                                : "hover:bg-muted/50"
                                            }
                                            ${
                                              admin._id === currentAdmin?._id
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                            }
                                        `}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs">
                        {getInitials(admin.firstName, admin.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {admin.firstName} {admin.lastName}
                        </p>
                        {admin._id === currentAdmin?._id && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {admin.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {admin.role === "super-admin" ? (
                        <Badge variant="default" className="gap-1 text-xs">
                          <Shield className="h-3 w-3" />
                          Super
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <User className="h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                      {!admin.isActive && (
                        <Badge variant="destructive" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Panel */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Edit Admin</CardTitle>
            <CardDescription>
              {selectedAdmin
                ? `Editing ${selectedAdmin.firstName} ${selectedAdmin.lastName}`
                : "Select an admin from the list to edit their details."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedAdmin ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <User className="h-12 w-12 mb-4 opacity-50" />
                <p>Select an admin to view and edit their details.</p>
                <p className="text-sm mt-1">
                  You cannot edit your own account from here.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpdateAdmin} className="space-y-6">
                {/* Basic Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">First Name</Label>
                    <Input
                      id="editFirstName"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Last Name</Label>
                    <Input
                      id="editLastName"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email Address</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="editRole">Role</Label>
                    <Select
                      value={editRole}
                      onValueChange={(value: AdminRole) => setEditRole(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Status</Label>
                    <div className="flex items-center justify-between rounded-md border p-3 h-10">
                      <span className="text-sm">
                        {editIsActive ? "Active" : "Inactive"}
                      </span>
                      <Switch
                        checked={editIsActive}
                        onCheckedChange={setEditIsActive}
                      />
                    </div>
                  </div>
                </div>

                {/* Business Access */}
                {editRole === "admin" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Business Access
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {editBusinessIds.length} selected
                      </span>
                    </div>
                    {isLoadingBusinesses ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : businesses.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        No businesses available.
                      </p>
                    ) : (
                      <div className="max-h-[200px] overflow-y-auto rounded-md border">
                        {businesses.map((business) => (
                          <label
                            key={business._id}
                            className="flex items-center gap-3 border-b p-2.5 last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Checkbox
                              checked={editBusinessIds.includes(business._id)}
                              onCheckedChange={() =>
                                toggleBusinessSelection(business._id)
                              }
                            />
                            <span className="text-sm truncate">
                              {business.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {editRole === "super-admin" && (
                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Super Admin Access
                    </p>
                    <p className="mt-1">
                      This admin has full access to all businesses and system
                      features.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAdmin}
                    disabled={deleteAdmin.isPending}
                  >
                    {deleteAdmin.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Deactivate
                  </Button>
                  <Button type="submit" disabled={updateAdmin.isPending}>
                    {updateAdmin.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Pencil className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
