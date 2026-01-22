"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Grid3X3,
  List,
  Plus,
  Search,
  Loader2,
  Building2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/components/business-card";
import { BusinessListItem } from "@/components/business-list-item";
import { useBusinesses } from "@/hooks/useBusiness";
import { useAdminStore } from "@/store/admin.store";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const { data: businesses = [], isLoading, isError, error } = useBusinesses();
  const { isSuperAdmin } = useAdminStore();
  const canCreateBusiness = isSuperAdmin();

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false),
  );

  // Check if regular admin has no businesses assigned
  const isAdminWithNoAccess = !canCreateBusiness && businesses.length === 0;

  const handleCreateBusiness = () => {
    router.push("/create");
  };

  return (
    <div className="space-y-6 bg-background">
      {/* Show special empty state for admins with no business access */}
      {isAdminWithNoAccess ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[480px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <ShieldAlert className="h-10 w-10 text-amber-600 dark:text-amber-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No Business Access</h3>
            <p className="mb-4 mt-2 text-base text-muted-foreground">
              You haven't been assigned to any businesses yet. Please contact
              your Super Admin to request access to one or more businesses.
            </p>
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Need access?</p>
              <p className="mt-1">
                Ask your Super Admin to add you to a business from the Admin
                Management panel.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search, Layout Toggle & Create Button - Single Row */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
              <Button
                variant={layout === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setLayout("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={layout === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setLayout("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>

            {/* Add New Button */}
            {canCreateBusiness && (
              <Button
                className="gap-2"
                onClick={handleCreateBusiness}
              >
                Add New...
              </Button>
            )}
          </div>

          {/* Business Grid/List */}
          {filteredBusinesses.length > 0 ? (
            layout === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business._id} business={business} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredBusinesses.map((business) => (
                  <BusinessListItem key={business._id} business={business} />
                ))}
              </div>
            )
          ) : (
            /* Empty State for Super Admin */
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">
                  {searchQuery ? "No businesses found" : "No businesses yet"}
                </h3>
                <p className="mb-4 mt-2 text-base text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Get started by creating your first business. You can add blog posts and manage content for each business."}
                </p>
                {!searchQuery && canCreateBusiness && (
                  <Button
                    className="gap-2"
                    onClick={handleCreateBusiness}
                  >
                    <Plus className="h-4 w-4" />
                    Create Business
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
