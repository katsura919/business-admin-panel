"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { BusinessTopbar } from "@/components/business-topbar";
import { useAdminStore } from "@/store/admin.store";
import { useCurrentAdmin } from "@/hooks/useAuth";
import { useBusinessById } from "@/hooks/useBusiness";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { isAuthenticated, setAdmin, logout } = useAdminStore();
  const { data: admin, isLoading, isError } = useCurrentAdmin();

  // Detect if we're on a business detail page
  const isBusinessRoute = pathname.startsWith("/business/");
  const businessId = isBusinessRoute ? (params.id as string) : undefined;

  // Only fetch business data when on a business route
  const { data: business } = useBusinessById(businessId || "");

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

  return (
    <div className="min-h-screen bg-background">
      {isBusinessRoute && businessId ? (
        <BusinessTopbar businessId={businessId} businessName={business?.name} />
      ) : (
        <Topbar />
      )}
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
