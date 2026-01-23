"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, LogOut, User } from "lucide-react";
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
import { useStaffLogout } from "@/hooks/useAuthStaff";
import { useStaffStore } from "@/store/staff.store";
import { cn } from "@/lib/utils";

// Staff navigation items
const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Attendance History", href: "/attendance" },
];

export function StaffTopbar() {
    const logout = useStaffLogout();
    const pathname = usePathname();
    const { staff, getFullName, getInitials } = useStaffStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Row: Logo, Title & Actions */}
            <div className="flex h-12 items-center justify-between px-4 md:px-6">
                {/* Left: Logo & Title */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/staff/dashboard"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Clock className="h-4 w-4" />
                        </div>
                    </Link>

                    <span className="text-lg font-medium text-foreground">Staff Portal</span>
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
                                    <p className="text-sm font-medium">{getFullName()}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {staff?.position}
                                        {staff?.department && ` • ${staff.department}`}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                My Profile
                            </DropdownMenuItem>
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

            {/* Bottom Row: Navigation Tabs */}
            <nav className="flex items-center gap-0 px-4 md:px-6 overflow-x-auto">
                {navigation.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
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
