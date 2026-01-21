"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { useCreateAdmin } from "@/hooks/useAdmin";
import { useBusinesses } from "@/hooks/useBusiness";
import type { AdminRole } from "@/types/admin.types";

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAdminDialog({
  open,
  onOpenChange,
}: CreateAdminDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const createAdmin = useCreateAdmin();
  const { data: businesses = [] } = useBusinesses();

  const handleSubmit = (e: React.FormEvent) => {
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
          // Reset form
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setRole("admin");
          setSelectedBusinessIds([]);
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
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Create a new admin account. Super-admins have full access to all
            businesses.
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createAdmin.isPending}>
              {createAdmin.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Admin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
