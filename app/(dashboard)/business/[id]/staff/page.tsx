"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Users, Plus, Loader2 } from "lucide-react";
import { useStaffByBusiness } from "@/hooks/useStaff";
import { useBusinessById } from "@/hooks/useBusiness";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { StaffQueryParams } from "@/types/staff.types";

export default function StaffPage() {
  const params = useParams();
  const businessId = params.id as string;

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [employmentType, setEmploymentType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Build query params
  const queryParams: StaffQueryParams = {
    page,
    limit,
    ...(search && { search }),
    ...(status !== "all" && { status: status as StaffQueryParams["status"] }),
    ...(employmentType !== "all" && {
      employmentType: employmentType as StaffQueryParams["employmentType"],
    }),
  };

  // Fetch data
  const { data: business, isLoading: isBusinessLoading } =
    useBusinessById(businessId);
  const {
    data: staffData,
    isLoading: isStaffLoading,
    isError,
  } = useStaffByBusiness(businessId, queryParams);

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleEmploymentTypeFilter = useCallback((value: string) => {
    setEmploymentType(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Loading state
  if (isBusinessLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (isError || !business) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <Users className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Unable to Load Staff</h3>
        <p className="mt-2 text-base text-muted-foreground">
          There was an error loading the staff data. Please try again.
        </p>
      </div>
    );
  }

  const staff = staffData?.data || [];
  const pagination = staffData?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their information for {business.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span className="font-medium text-foreground">
                {pagination.total}
              </span>
              <span>total staff</span>
            </div>
          )}
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={staff}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onEmploymentTypeFilter={handleEmploymentTypeFilter}
        searchValue={search}
        statusFilter={status}
        employmentTypeFilter={employmentType}
        isLoading={isStaffLoading}
      />
    </div>
  );
}
