"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserPlus, Users, Shield } from "lucide-react";
import { RequireSuperAdmin } from "@/components/auth/require-auth";
import { Loader2 } from "lucide-react";

const settingsNavItems = [
  {
    title: "Create Admin",
    href: "/settings/create-admin",
    icon: UserPlus,
    description: "Add new administrators",
  },
  {
    title: "Manage Admins",
    href: "/settings/manage-admins",
    icon: Users,
    description: "Edit admin permissions",
  },
];

function SettingsLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:shrink-0">
        <div className="sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <nav className="flex flex-col gap-1">
            {settingsNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span
                      className={cn(
                        "text-xs",
                        isActive
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireSuperAdmin
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SettingsLayoutContent>{children}</SettingsLayoutContent>
    </RequireSuperAdmin>
  );
}
