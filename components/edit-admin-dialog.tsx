"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpdateAdmin } from "@/hooks/useAdmin";
import { useBusinesses } from "@/hooks/useBusiness";
import type { Admin, AdminRole } from "@/types/admin.types";

interface EditAdminDialogProps {
  admin: Admin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAdminDialog({
  admin,
  open,
  onOpenChange,
}: EditAdminDialogProps) {
  const [firstName, setFirstName] = useState(admin.firstName);
  const [lastName, setLastName] = useState(admin.lastName);
  const [email, setEmail] = useState(admin.email);
  const [role, setRole] = useState<AdminRole>(admin.role);
  const [isActive, setIsActive] = useState(admin.isActive);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>(
    admin.businessIds || [],
  );

  const updateAdmin = useUpdateAdmin();
  const { data: businesses = [] } = useBusinesses();

  // Reset form when admin changes
  useEffect(() => {
    setFirstName(admin.firstName);
    setLastName(admin.lastName);
    setEmail(admin.email);
    setRole(admin.role);
    setIsActive(admin.isActive);
    setSelectedBusinessIds(admin.businessIds || []);
  }, [admin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateAdmin.mutate(
      {
        id: admin._id,
        data: {
          firstName,
          lastName,
          email,
          role,
          isActive,
          businessIds: role === "admin" ? selectedBusinessIds : [],
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const toggleBusinessSelection = (businessId: string) => {
    setSelectedBusinessIds((prev) =>
      prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>
            Update admin details and permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: AdminRole) => setRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (Limited Access)</SelectItem>
                  <SelectItem value="super-admin">
                    Super Admin (Full Access)
                  </SelectItem>
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
                      <input
                        type="checkbox"
                        checked={selectedBusinessIds.includes(business._id)}
                        onChange={() => toggleBusinessSelection(business._id)}
                        className="rounded"
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
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Account Status</Label>
                <p className="text-sm text-muted-foreground">
                  {isActive
                    ? "Admin can log in and access the system."
                    : "Admin is deactivated."}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateAdmin.isPending}>
              {updateAdmin.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
