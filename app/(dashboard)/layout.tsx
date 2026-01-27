"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { useAdminStore } from "@/store/admin.store";
import { useCurrentAdmin } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setAdmin, logout } = useAdminStore();
  const { data: admin, isLoading, isError } = useCurrentAdmin();

  // Detect if we're on a business detail page (has its own layout with sidebar)
  const isBusinessRoute = pathname.startsWith("/business/");

  useEffect(() => {
    // If we have fresh admin data from API, update the store
    if (admin) {
      setAdmin(admin);
    }
  }, [admin, setAdmin]);

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

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Business routes have their own sidebar layout
  if (isBusinessRoute) {
    return <>{children}</>;
  }

  // Non-business routes use the topbar layout
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
