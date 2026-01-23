"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  Search,
  X,
  FileText,
  Loader2,
  LayoutGrid,
  List,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Blog, BlogPaginationInfo } from "@/types/blog.types";

type ViewMode = "table" | "grid";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onSearch?: (search: string) => void;
  onStatusFilter?: (status: string) => void;
  searchValue?: string;
  statusFilter?: string;
  pagination?: BlogPaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const statusConfig = {
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  draft: {
    label: "Draft",
    className: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  },
};

// Grid Card Component
function BlogGridCard({ blog }: { blog: Blog }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-foreground/20">
      {/* Featured Image */}
      {blog.featuredImage ? (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
        </div>
      )}

      <CardHeader className="p-3 pb-1.5">
        <div className="flex items-start justify-between gap-1.5">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className={`font-normal text-[10px] px-1.5 py-0 ${statusConfig[blog.status].className}`}
              >
                {statusConfig[blog.status].label}
              </Badge>
            </div>
            <h3 className="font-medium text-xs leading-tight line-clamp-2">
              {blog.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px]">
              <DropdownMenuItem className="text-xs">
                <Eye className="mr-2 h-3.5 w-3.5" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                View live
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-1.5">
        {blog.excerpt && (
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {blog.excerpt}
          </p>
        )}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="h-2.5 w-2.5" />
          {blog.publishedAt
            ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
        </div>
      </CardContent>
    </Card>
  );
}

export function BlogDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onSearch,
  onStatusFilter,
  searchValue = "",
  statusFilter = "all",
  pagination,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [localSearch, setLocalSearch] = React.useState(searchValue);
  const [viewMode, setViewMode] = React.useState<ViewMode>("table");

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: !!pagination,
    pageCount: pagination?.totalPages ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(pagination && {
        pagination: {
          pageIndex: pagination.page - 1,
          pageSize: pagination.limit,
        },
      }),
    },
  });

  const hasFilters = localSearch || statusFilter !== "all";

  const clearFilters = () => {
    setLocalSearch("");
    onSearch?.("");
    onStatusFilter?.("all");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="h-9 pl-9 bg-background"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilter}>
            <SelectTrigger className="h-9 w-[130px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-9 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <TooltipProvider>
            <div className="flex items-center rounded-lg border bg-background p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">Table view</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Table view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid view</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Column Visibility - Only show in table view */}
          {viewMode === "table" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-dashed"
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border bg-card">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Loading posts...
            </span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border bg-card">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">No posts found</p>
              <p className="text-xs text-muted-foreground">
                {hasFilters
                  ? "Try adjusting your search or filters"
                  : "Create your first blog post to get started"}
              </p>
            </div>
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {table.getRowModel().rows.map((row) => (
            <BlogGridCard key={row.id} blog={row.original as Blog} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-11 bg-muted/50 text-xs font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {(data.length > 0 || pagination) && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {viewMode === "table" &&
            table.getFilteredSelectedRowModel().rows.length > 0 ? (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {pagination?.totalItems ??
                  table.getFilteredRowModel().rows.length}{" "}
                row(s) selected.
              </span>
            ) : (
              <span>
                {pagination?.totalItems ??
                  table.getFilteredRowModel().rows.length}{" "}
                post(s) total
              </span>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">
                {viewMode === "grid" ? "Per page" : "Rows per page"}
              </p>
              <Select
                value={`${pagination?.limit ?? table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  if (onPageSizeChange) {
                    onPageSizeChange(Number(value));
                  } else {
                    table.setPageSize(Number(value));
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={
                      pagination?.limit ?? table.getState().pagination.pageSize
                    }
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[6, 9, 12, 18, 24].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page{" "}
              {pagination?.page ?? table.getState().pagination.pageIndex + 1} of{" "}
              {(pagination?.totalPages ?? table.getPageCount()) || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => {
                  if (onPageChange) {
                    onPageChange(1);
                  } else {
                    table.setPageIndex(0);
                  }
                }}
                disabled={
                  pagination
                    ? !pagination.hasPrevPage
                    : !table.getCanPreviousPage()
                }
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (onPageChange && pagination) {
                    onPageChange(pagination.page - 1);
                  } else {
                    table.previousPage();
                  }
                }}
                disabled={
                  pagination
                    ? !pagination.hasPrevPage
                    : !table.getCanPreviousPage()
                }
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  if (onPageChange && pagination) {
                    onPageChange(pagination.page + 1);
                  } else {
                    table.nextPage();
                  }
                }}
                disabled={
                  pagination ? !pagination.hasNextPage : !table.getCanNextPage()
                }
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => {
                  if (onPageChange && pagination) {
                    onPageChange(pagination.totalPages);
                  } else {
                    table.setPageIndex(table.getPageCount() - 1);
                  }
                }}
                disabled={
                  pagination ? !pagination.hasNextPage : !table.getCanNextPage()
                }
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
