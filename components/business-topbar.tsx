"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LogOut, Settings, User, Shield, ChevronRight, ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme-toggle";
import { useLogout } from "@/hooks/useAuth";
import { useAdminStore } from "@/store/admin.store";
import { useBusinesses } from "@/hooks/useBusiness";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BusinessTopbarProps {
    businessId: string;
    businessName?: string;
}

export function BusinessTopbar({ businessId, businessName }: BusinessTopbarProps) {
    const logout = useLogout();
    const pathname = usePathname();
    const router = useRouter();
    const { admin, isSuperAdmin, getFullName, getInitials } = useAdminStore();
    const { data: businesses = [] } = useBusinesses();

    // Navigation items for business context - only Overview and Blog
    const businessNavigation = [
        { name: "Overview", href: `/business/${businessId}` },
        { name: "Blog", href: `/business/${businessId}/blog` },
    ];

    const handleBusinessSwitch = (newBusinessId: string) => {
        // Navigate to the same page type but for the new business
        const currentPath = pathname;
        if (currentPath.includes("/blog")) {
            router.push(`/business/${newBusinessId}/blog`);
        } else {
            router.push(`/business/${newBusinessId}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Row: Logo, Breadcrumb & Actions */}
            <div className="flex h-12 items-center justify-between px-4 md:px-6">
                {/* Left: Logo, Breadcrumb & Title */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/overview"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Building2 className="h-4 w-4" />
                        </div>
                    </Link>

                    {/* Breadcrumb separator */}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />

                    {/* Business name with switcher dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 gap-1.5 px-2 font-medium text-foreground hover:bg-muted"
                            >
                                <span className="truncate max-w-[180px]">
                                    {businessName || "Business"}
                                </span>
                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64">
                            <DropdownMenuLabel>Switch Business</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {businesses.map((business) => (
                                <DropdownMenuItem
                                    key={business._id}
                                    onClick={() => handleBusinessSwitch(business._id)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10">
                                            <Building2 className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <span className="truncate">{business.name}</span>
                                    </div>
                                    {business._id === businessId && (
                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                            {businesses.length === 0 && (
                                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                    No businesses available
                                </div>
                            )}
                            <DropdownMenuSeparator />
                            <Link href="/overview">
                                <DropdownMenuItem className="cursor-pointer">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    View All Businesses
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className="text-xs">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{getFullName()}</p>
                                        {isSuperAdmin() && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs px-1.5 py-0"
                                            >
                                                <Shield className="h-3 w-3 mr-1" />
                                                Super
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {admin?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            {isSuperAdmin() && (
                                <Link href="/settings">
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={logout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Bottom Row: Navigation Tabs - Overview and Blog only */}
            <nav className="flex items-center gap-0 px-4 md:px-6 overflow-x-auto">
                {businessNavigation.map((item) => {
                    // Exact match for Overview, startsWith for Blog
                    const isActive = item.name === "Overview"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative px-3 py-2 text-sm transition-colors hover:text-foreground",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
