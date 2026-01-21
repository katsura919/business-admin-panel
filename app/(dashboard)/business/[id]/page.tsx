"use client";

import { useParams } from "next/navigation";
import { Building2, ExternalLink, Globe, Calendar, Loader2 } from "lucide-react";
import Image from "next/image";
import { useBusinessById } from "@/hooks/useBusiness";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BusinessOverviewPage() {
    const params = useParams();
    const businessId = params.id as string;
    const { data: business, isLoading, isError } = useBusinessById(businessId);

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !business) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <Building2 className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Business Not Found</h3>
                <p className="mt-2 text-base text-muted-foreground">
                    The business you're looking for doesn't exist or you don't have access to it.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Business Header */}
            <div className="flex items-start gap-4">
                {business.logo ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border">
                        <Image
                            src={business.logo}
                            alt={`${business.name} logo`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <Badge variant={business.isActive ? "default" : "secondary"}>
                            {business.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    {business.description && (
                        <p className="mt-1 text-base text-muted-foreground">{business.description}</p>
                    )}
                </div>
            </div>

            {/* Business Details Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Website Card */}
                {business.website && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Globe className="h-4 w-4" />
                                Website
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-primary hover:underline"
                            >
                                {business.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </CardContent>
                    </Card>
                )}

                {/* Slug Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Building2 className="h-4 w-4" />
                            Slug
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="rounded bg-muted px-2 py-1 text-sm">{business.slug}</code>
                    </CardContent>
                </Card>

                {/* Created Date Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="h-4 w-4" />
                            Created
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            {new Date(business.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for future content */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Overview</CardTitle>
                    <CardDescription>
                        View and manage your business details, analytics, and content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Additional business information and analytics will be displayed here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
