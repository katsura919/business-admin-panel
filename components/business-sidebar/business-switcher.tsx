"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Building2, ChevronsUpDown, Plus, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useBusinesses } from "@/hooks/useBusiness";
import { useAdminStore } from "@/store/admin.store";
import type { Business } from "@/types/business.types";

interface BusinessSwitcherProps {
  currentBusinessId: string;
  currentBusiness?: Business;
}

export function BusinessSwitcher({
  currentBusinessId,
  currentBusiness,
}: BusinessSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { data: businesses = [] } = useBusinesses();
  const { isSuperAdmin } = useAdminStore();

  const handleBusinessSwitch = (newBusinessId: string) => {
    if (newBusinessId === currentBusinessId) return;

    // Navigate to the same page type but for the new business
    if (pathname.includes("/blog/create")) {
      router.push(`/business/${newBusinessId}/blog/create`);
    } else if (pathname.includes("/blog")) {
      router.push(`/business/${newBusinessId}/blog`);
    } else if (pathname.includes("/settings")) {
      router.push(`/business/${newBusinessId}/settings`);
    } else if (pathname.includes("/staff")) {
      router.push(`/business/${newBusinessId}/staff`);
    } else {
      router.push(`/business/${newBusinessId}`);
    }
  };

  const handleCreateBusiness = () => {
    router.push("/create");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground">
                {currentBusiness?.logo ? (
                  <Image
                    src={currentBusiness.logo}
                    alt={currentBusiness.name}
                    width={32}
                    height={32}
                    className="size-8 object-cover"
                  />
                ) : (
                  <Building2 className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentBusiness?.name || "Loading..."}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentBusiness?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Businesses
            </DropdownMenuLabel>
            {businesses.map((business) => (
              <DropdownMenuItem
                key={business._id}
                onClick={() => handleBusinessSwitch(business._id)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border overflow-hidden">
                  {business.logo ? (
                    <Image
                      src={business.logo}
                      alt={business.name}
                      width={24}
                      height={24}
                      className="size-6 object-cover"
                    />
                  ) : (
                    <Building2 className="size-3.5 shrink-0" />
                  )}
                </div>
                <span className="flex-1 truncate">{business.name}</span>
                {business._id === currentBusinessId && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            {isSuperAdmin() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2 cursor-pointer"
                  onClick={handleCreateBusiness}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <span className="text-muted-foreground font-medium">
                    Add business
                  </span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
