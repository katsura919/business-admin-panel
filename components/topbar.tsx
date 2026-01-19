"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    ChevronRight,
    Home,
    LogOut,
    Plus,
    Settings,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle";
import { currentUser } from "@/lib/data";

const navigation = [
    { name: "Overview", href: "/overview", icon: Home },
    { name: "Businesses", href: "/businesses", icon: Building2 },
];

function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        const isLast = index === segments.length - 1;

        return { name, href, isLast };
    });
}

export function Topbar() {
    const pathname = usePathname();
    const breadcrumbs = generateBreadcrumbs(pathname);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4 md:px-6">
                {/* Left: Logo & Breadcrumb */}
                <div className="flex items-center gap-4">
                    <Link href="/overview" className="flex items-center gap-2 font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <span className="hidden sm:inline-block">Business Admin</span>
                    </Link>

                    <Separator orientation="vertical" className="h-6 hidden md:block" />

                    <Breadcrumb className="hidden md:flex">
                        <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <BreadcrumbItem key={crumb.href}>
                                    {index > 0 && <BreadcrumbSeparator />}
                                    {crumb.isLast ? (
                                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Create Business</span>
                    </Button>

                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                    <AvatarFallback className="text-xs">
                                        {currentUser.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{currentUser.name}</p>
                                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
