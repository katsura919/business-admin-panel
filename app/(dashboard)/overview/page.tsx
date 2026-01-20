"use client";

import { useState } from "react";
import { Grid3X3, List, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/components/business-card";
import { BusinessListItem } from "@/components/business-list-item";
import { useBusinesses } from "@/hooks/useBusiness";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [layout, setLayout] = useState<"grid" | "list">("grid");

    const { data: businesses = [], isLoading, isError, error } = useBusinesses();

    const filteredBusinesses = businesses.filter((business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    return (
        <div className="space-y-6 bg-background">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                        Your Businesses
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your businesses and their blog content.
                    </p>
                </div>
                <Button className="gap-2 w-fit">
                    <Plus className="h-4 w-4" />
                    Create Business
                </Button>
            </div>

            {/* Search and Layout Toggle */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search businesses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
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
                /* Empty State */
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">
                            {searchQuery ? "No businesses found" : "No businesses yet"}
                        </h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            {searchQuery
                                ? "Try adjusting your search terms."
                                : "Get started by creating your first business. You can add blog posts and manage content for each business."}
                        </p>
                        {!searchQuery && (
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Business
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
