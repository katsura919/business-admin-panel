"use client";

import Image from "next/image";
import { Building2, ExternalLink, MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Business } from "@/types/business.types";

interface BusinessCardProps {
    business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
    return (
        <Card className="group relative transition-all hover:shadow-md hover:border-foreground/20">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {business.logo ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                                <Image
                                    src={business.logo}
                                    alt={`${business.name} logo`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold leading-none">
                                {business.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Created {new Date(business.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <CardDescription className="line-clamp-2 text-base">
                    {business.description || "No description available"}
                </CardDescription>
                {business.website && (
                    <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                        <ExternalLink className="h-3 w-3" />
                        {business.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                )}
            </CardContent>
        </Card>
    );
}
