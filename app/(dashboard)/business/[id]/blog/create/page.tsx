"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateBlog } from "@/hooks/useBlog";
import { useBusinessById } from "@/hooks/useBusiness";
import type { BlogStatus } from "@/types/blog.types";

export default function CreateBlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const businessId = params.id as string;

    const { data: business } = useBusinessById(businessId);
    const createBlog = useCreateBlog();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        status: "draft" as BlogStatus,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
        if (errors.title) {
            setErrors((prev) => ({ ...prev, title: "" }));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleStatusChange = (value: BlogStatus) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!formData.slug.trim()) {
            newErrors.slug = "Slug is required";
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = "Slug must be lowercase with hyphens only";
        }
        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        createBlog.mutate(
            {
                title: formData.title,
                slug: formData.slug,
                content: formData.content,
                excerpt: formData.excerpt || undefined,
                featuredImage: formData.featuredImage || undefined,
                businessId,
                status: formData.status,
            },
            {
                onSuccess: () => {
                    router.push(`/business/${businessId}/blog`);
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/business/${businessId}/blog`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Create New Post</h1>
                    <p className="text-sm text-muted-foreground">
                        Create a new blog post for {business?.name || "this business"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Details</CardTitle>
                                <CardDescription>
                                    Enter the main content for your blog post
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Enter post title"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        className={errors.title ? "border-destructive" : ""}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug *</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        placeholder="post-url-slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className={errors.slug ? "border-destructive" : ""}
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-destructive">{errors.slug}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Lowercase letters, numbers, and hyphens only
                                    </p>
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        placeholder="Write your blog post content..."
                                        value={formData.content}
                                        onChange={handleChange}
                                        className={`min-h-[300px] ${errors.content ? "border-destructive" : ""}`}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-destructive">{errors.content}</p>
                                    )}
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        name="excerpt"
                                        placeholder="Short summary of the post (optional)"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        className="min-h-[100px]"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        A brief description shown in post listings
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Publish Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={handleStatusChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {formData.status === "published"
                                            ? "This post will be visible immediately"
                                            : "Save as draft to publish later"}
                                    </p>
                                </div>

                                {/* Featured Image */}
                                <div className="space-y-2">
                                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                                    <Input
                                        id="featuredImage"
                                        name="featuredImage"
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.featuredImage}
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter a URL for the featured image
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="submit"
                                        disabled={createBlog.isPending}
                                        className="w-full gap-2"
                                    >
                                        {createBlog.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                {formData.status === "published" ? "Publish" : "Save Draft"}
                                            </>
                                        )}
                                    </Button>
                                    <Link href={`/business/${businessId}/blog`} className="w-full">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            disabled={createBlog.isPending}
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
