"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Search, FileText, Calendar, Loader2, MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlogsByBusiness } from "@/hooks/useBlog";
import { useBusinessById } from "@/hooks/useBusiness";
import type { Blog } from "@/types/blog.types";

export default function BusinessBlogPage() {
    const params = useParams();
    const businessId = params.id as string;
    const [searchQuery, setSearchQuery] = useState("");

    const { data: business } = useBusinessById(businessId);
    const { data: blogs = [], isLoading, isError } = useBlogsByBusiness(businessId);

    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    const handleInteractiveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search & Create Button */}
            <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search blog posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>

                {/* Create Blog Button */}
                <Link href={`/business/${businessId}/blog/create`}>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            {/* Blog Posts Grid */}
            {filteredBlogs.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} onInteractiveClick={handleInteractiveClick} />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">
                            {searchQuery ? "No blog posts found" : "No blog posts yet"}
                        </h3>
                        <p className="mb-4 mt-2 text-base text-muted-foreground">
                            {searchQuery
                                ? "Try adjusting your search terms."
                                : `Start creating content for ${business?.name || "this business"}. Blog posts help attract customers and improve SEO.`}
                        </p>
                        {!searchQuery && (
                            <Link href={`/business/${businessId}/blog/create`}>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create First Post
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

interface BlogCardProps {
    blog: Blog;
    onInteractiveClick: (e: React.MouseEvent) => void;
}

function BlogCard({ blog, onInteractiveClick }: BlogCardProps) {
    return (
        <Card className="group relative transition-all hover:shadow-md hover:border-foreground/20 cursor-pointer">
            {/* Featured Image */}
            {blog.featuredImage && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <Badge variant={blog.status === "published" ? "default" : "secondary"}>
                                {blog.status}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                            {blog.title}
                        </CardTitle>
                    </div>
                    <div onClick={onInteractiveClick}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {blog.excerpt && (
                    <CardDescription className="line-clamp-2 text-sm">
                        {blog.excerpt}
                    </CardDescription>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
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
