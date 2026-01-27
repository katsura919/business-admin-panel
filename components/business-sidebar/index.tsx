"use client";

import * as React from "react";

import { BusinessSwitcher } from "./business-switcher";
import { BusinessNavMain } from "./business-nav-main";
import { BusinessNavUser } from "./business-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Business } from "@/types/business.types";

interface BusinessSidebarProps extends React.ComponentProps<typeof Sidebar> {
  businessId: string;
  business?: Business;
}

export function BusinessSidebar({
  businessId,
  business,
  ...props
}: BusinessSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BusinessSwitcher
          currentBusinessId={businessId}
          currentBusiness={business}
        />
      </SidebarHeader>
      <SidebarContent>
        <BusinessNavMain businessId={businessId} />
      </SidebarContent>
      <SidebarFooter>
        <BusinessNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
