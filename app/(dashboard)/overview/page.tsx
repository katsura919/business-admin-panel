import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/business-card";
import { businesses } from "@/lib/data";

export default function OverviewPage() {
    return (
        <div className="space-y-8 bg-background">
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

            {/* Business Grid */}
            {businesses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {businesses.map((business) => (
                        <BusinessCard key={business.id} business={business} />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No businesses yet</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            Get started by creating your first business. You can add blog posts
                            and manage content for each business.
                        </p>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Business
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
