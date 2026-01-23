"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogsByBusiness } from "@/hooks/useBlog";
import { useBusinessById } from "@/hooks/useBusiness";
import { columns } from "./columns";
import { BlogDataTable } from "./data-table";
import type { BlogQueryParams } from "@/types/blog.types";

export default function BusinessBlogPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [queryParams, setQueryParams] = useState<BlogQueryParams>({
    search: "",
    page: 1,
    limit: 10,
    status: "all",
  });

  const { data: business, isLoading: isBusinessLoading } =
    useBusinessById(businessId);
  const {
    data: blogResponse,
    isLoading: isBlogsLoading,
    isError,
  } = useBlogsByBusiness(businessId, queryParams);

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setQueryParams((prev) => ({ ...prev, search: value, page: 1 }));
  }, []);

  const handleStatusFilter = useCallback((value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      status: value as BlogQueryParams["status"],
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((limit: number) => {
    setQueryParams((prev) => ({ ...prev, limit, page: 1 }));
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
          <FileText className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Unable to Load Blog</h3>
        <p className="mt-2 text-base text-muted-foreground">
          There was an error loading the blog data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage blog posts for {business.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <span className="font-medium text-foreground">
              {blogResponse?.pagination.totalItems ?? 0}
            </span>
            <span>total posts</span>
          </div>
          <Link href={`/business/${businessId}/blog/create`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <BlogDataTable
        columns={columns}
        data={blogResponse?.data ?? []}
        isLoading={isBlogsLoading}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        searchValue={queryParams.search}
        statusFilter={queryParams.status}
        pagination={blogResponse?.pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
