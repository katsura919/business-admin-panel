'use client';

import { useStaffStore } from "@/store/staff.store";
import { useStaffLogout } from "@/hooks/useAuthStaff";
import { Button } from "@/components/ui/button";
import { LogOut, Clock } from "lucide-react";

export default function StaffDashboardPage() {
    const { staff, getFullName, getInitials } = useStaffStore();
    const logout = useStaffLogout();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Clock className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-semibold">Staff Portal</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                                {getInitials()}
                            </div>
                            <span className="text-sm font-medium">{getFullName()}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <h2 className="text-3xl font-bold mb-4">Welcome, {staff?.firstName}!</h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        Staff Dashboard - Coming Soon
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Position: {staff?.position} | Department: {staff?.department || 'N/A'}
                    </p>
                </div>
            </main>
        </div>
    );
}
