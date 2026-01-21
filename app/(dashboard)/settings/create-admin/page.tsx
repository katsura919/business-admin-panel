"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useCreateAdmin } from "@/hooks/useAdmin";
import { useBusinesses } from "@/hooks/useBusiness";
import type { AdminRole } from "@/types/admin.types";

export default function CreateAdminPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const createAdmin = useCreateAdmin();
  const { data: businesses = [], isLoading: isLoadingBusinesses } =
    useBusinesses();

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
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
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

  const selectAllBusinesses = () => {
    setSelectedBusinessIds(businesses.map((b) => b._id));
  };

  const clearBusinessSelection = () => {
    setSelectedBusinessIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Admin</h1>
        <p className="text-muted-foreground">
          Add a new administrator to the system. Choose their role and assign
          business access.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <CheckCircle2 className="h-5 w-5" />
          <span>Admin created successfully!</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Admin Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Admin Details
            </CardTitle>
            <CardDescription>
              Enter the basic information for the new admin account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="create-admin-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
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
                <Label htmlFor="email">Email Address</Label>
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
                    <SelectItem value="admin">
                      <div className="flex flex-col">
                        <span>Admin</span>
                        <span className="text-xs text-muted-foreground">
                          Limited access to assigned businesses
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="super-admin">
                      <div className="flex flex-col">
                        <span>Super Admin</span>
                        <span className="text-xs text-muted-foreground">
                          Full access to all features
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Business Access Card */}
        <Card className={role === "super-admin" ? "opacity-50" : ""}>
          <CardHeader>
            <CardTitle>Business Access</CardTitle>
            <CardDescription>
              {role === "super-admin"
                ? "Super Admins have access to all businesses automatically."
                : "Select which businesses this admin can manage."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {role === "super-admin" ? (
              <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
                <p>Super Admins have full access to all businesses.</p>
              </div>
            ) : isLoadingBusinesses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : businesses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>No businesses available.</p>
                <p className="text-sm">
                  Create a business first to assign access.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllBusinesses}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearBusinessSelection}
                  >
                    Clear All
                  </Button>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {selectedBusinessIds.length} of {businesses.length} selected
                  </span>
                </div>

                {/* Business List */}
                <div className="max-h-[300px] overflow-y-auto rounded-md border">
                  {businesses.map((business) => (
                    <label
                      key={business._id}
                      className="flex items-center gap-3 border-b p-3 last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedBusinessIds.includes(business._id)}
                        onCheckedChange={() =>
                          toggleBusinessSelection(business._id)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{business.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {business.slug}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          form="create-admin-form"
          size="lg"
          disabled={createAdmin.isPending}
          className="gap-2"
        >
          {createAdmin.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create Admin
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
