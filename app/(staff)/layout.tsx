"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StaffTopbar } from "@/components/staff-topbar";
import { useStaffStore } from "@/store/staff.store";
import { useCurrentStaff } from "@/hooks/useAuthStaff";
import { Loader2 } from "lucide-react";

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, setStaff, logout } = useStaffStore();
    const { data: staff, isLoading, isError } = useCurrentStaff();

    useEffect(() => {
        // If we have fresh staff data from API, update the store
        if (staff) {
            setStaff(staff);
        }
    }, [staff, setStaff]);

    useEffect(() => {
        // If not authenticated and not loading, redirect to login
        if (!isAuthenticated && !isLoading) {
            router.push("/login");
        }
        // If there's an auth error (invalid token), logout and redirect
        if (isError && isAuthenticated) {
            logout();
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, isError, router, logout]);

    // Show loading state while checking authentication
    if (isLoading || (!isAuthenticated && !isError)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <StaffTopbar />
            <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
                {children}
            </main>
        </div>
    );
}
