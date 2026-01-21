"use client";

import { useState } from "react";
import {
  Search,
  Shield,
  User,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
} from "@/hooks/useAdmin";
import { useBusinesses } from "@/hooks/useBusiness";
import { useAdminStore } from "@/store/admin.store";
import type { Admin, AdminRole } from "@/types/admin.types";

export default function TeamMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Create form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<AdminRole>("admin");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editBusinessIds, setEditBusinessIds] = useState<string[]>([]);

  const { data: admins = [], isLoading: isLoadingAdmins } = useAdmins();
  const { data: businesses = [] } = useBusinesses();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const { admin: currentAdmin } = useAdminStore();

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  // Create admin handler
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    createAdmin.mutate(
      {
        firstName,
        lastName,
        email,
        password,
        role,
        businessIds: role === "admin" ? selectedBusinessIds : [],
      },
      {
        onSuccess: () => {
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setRole("admin");
          setSelectedBusinessIds([]);
        },
      }
    );
  };

  const toggleBusinessSelection = (businessId: string) => {
    setSelectedBusinessIds((prev) =>
      prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId]
    );
  };

  // Edit dialog handlers
  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditFirstName(admin.firstName);
    setEditLastName(admin.lastName);
    setEditEmail(admin.email);
    setEditRole(admin.role);
    setEditIsActive(admin.isActive);
    setEditBusinessIds(admin.businessIds || []);
    setEditDialogOpen(true);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    updateAdmin.mutate(
      {
        id: editingAdmin._id,
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
        onSuccess: () => {
          setEditDialogOpen(false);
          setEditingAdmin(null);
        },
      }
    );
  };

  const toggleEditBusinessSelection = (businessId: string) => {
    setEditBusinessIds((prev) =>
      prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId]
    );
  };

  const handleDeleteAdmin = (admin: Admin) => {
    if (confirm(`Are you sure you want to deactivate ${admin.firstName} ${admin.lastName}?`)) {
      deleteAdmin.mutate(admin._id);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Add Team Member Section */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Add Team Member</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new administrator account. Super-admins have full access to all businesses.
          </p>
        </div>
        <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: AdminRole) => setRole(value)}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin (Limited Access)</SelectItem>
                <SelectItem value="super-admin">Super Admin (Full Access)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "admin" && businesses.length > 0 && (
            <div className="space-y-2">
              <Label>Business Access</Label>
              <div className="max-h-32 overflow-y-auto rounded-md border p-2 space-y-1">
                {businesses.map((business) => (
                  <label
                    key={business._id}
                    className="flex items-center gap-2 cursor-pointer p-1 hover:bg-muted rounded"
                  >
                    <Checkbox
                      checked={selectedBusinessIds.includes(business._id)}
                      onCheckedChange={() => toggleBusinessSelection(business._id)}
                    />
                    <span className="text-sm">{business.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select which businesses this admin can manage.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={createAdmin.isPending}>
              {createAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Member
            </Button>
          </div>
        </form>
      </div>

      {/* Team Members Table Section */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your team members and their permissions.
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoadingAdmins ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <User className="h-12 w-12 mb-4 opacity-50" />
              <p>No team members found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Businesses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {admin.firstName} {admin.lastName}
                            </p>
                            {admin._id === currentAdmin?._id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
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
                      {admin.isActive ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {admin.role === "super-admin" ? (
                        <span className="text-sm text-muted-foreground">All businesses</span>
                      ) : admin.businessIds && admin.businessIds.length > 0 ? (
                        <span className="text-sm">{admin.businessIds.length} businesses</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">None assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(admin)}
                          disabled={admin._id === currentAdmin?._id}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAdmin(admin)}
                          disabled={admin._id === currentAdmin?._id || deleteAdmin.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Edit Admin Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member details and permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAdmin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>
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
                    <SelectItem value="admin">Admin (Limited Access)</SelectItem>
                    <SelectItem value="super-admin">Super Admin (Full Access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editRole === "admin" && businesses.length > 0 && (
                <div className="space-y-2">
                  <Label>Business Access</Label>
                  <div className="max-h-32 overflow-y-auto rounded-md border p-2 space-y-1">
                    {businesses.map((business) => (
                      <label
                        key={business._id}
                        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-muted rounded"
                      >
                        <Checkbox
                          checked={editBusinessIds.includes(business._id)}
                          onCheckedChange={() => toggleEditBusinessSelection(business._id)}
                        />
                        <span className="text-sm">{business.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="editIsActive">Account Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {editIsActive ? "Member can access the system." : "Member is deactivated."}
                  </p>
                </div>
                <Switch
                  id="editIsActive"
                  checked={editIsActive}
                  onCheckedChange={setEditIsActive}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateAdmin.isPending}>
                {updateAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
