"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/admin.store";

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface RequireSuperAdminProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Hook to check authorization
export function useAuthorization() {
  const { admin, isAuthenticated, isSuperAdmin, hasBusinessAccess } =
    useAdminStore();

  return {
    isAuthenticated,
    isSuperAdmin: isSuperAdmin(),
    hasBusinessAccess,
    admin,
    role: admin?.role,
  };
}

// Component to require authentication
export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const router = useRouter();
  const { isAuthenticated } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Component to require super-admin role
export function RequireSuperAdmin({
  children,
  fallback,
}: RequireSuperAdminProps) {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isSuperAdmin()) {
      router.push("/overview");
    }
  }, [isAuthenticated, isSuperAdmin, router]);

  if (!isAuthenticated || !isSuperAdmin()) {
    return fallback || null;
  }

  return <>{children}</>;
}

// HOC for protecting pages with authentication
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <RequireAuth>
        <WrappedComponent {...props} />
      </RequireAuth>
    );
  };
}

// HOC for protecting pages with super-admin requirement
export function withSuperAdmin<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function SuperAdminComponent(props: P) {
    return (
      <RequireSuperAdmin>
        <WrappedComponent {...props} />
      </RequireSuperAdmin>
    );
  };
}
