"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCreateBlog, useUploadBlogFeaturedImage } from "@/hooks/useBlog";
import { useBusinessById } from "@/hooks/useBusiness";
import type { BlogStatus } from "@/types/blog.types";

export default function CreateBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: business } = useBusinessById(businessId);
  const createBlog = useCreateBlog();
  const uploadFeaturedImage = useUploadBlogFeaturedImage();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft" as BlogStatus,
  });

  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSubmitting = createBlog.isPending || uploadFeaturedImage.isPending;

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          featuredImage:
            "Invalid file type. Please select a JPEG, PNG, WebP, or GIF image.",
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          featuredImage: "File is too large. Maximum size is 5MB.",
        }));
        return;
      }

      setFeaturedImageFile(file);
      setErrors((prev) => ({ ...prev, featuredImage: "" }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFeaturedImagePreview(previewUrl);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setFeaturedImageFile(null);
    if (featuredImagePreview) {
      URL.revokeObjectURL(featuredImagePreview);
    }
    setFeaturedImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    try {
      // Step 1: Create the blog
      const newBlog = await createBlog.mutateAsync({
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        category: formData.category || undefined,
        businessId,
        status: formData.status,
      });

      // Step 2: Upload featured image if selected
      if (featuredImageFile && newBlog._id) {
        await uploadFeaturedImage.mutateAsync({
          id: newBlog._id,
          file: featuredImageFile,
        });
      }

      // Navigate back to blog list
      router.push(`/business/${businessId}/blog`);
    } catch (error) {
      // Error handling is done in the hooks
      console.error("Failed to create blog:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header with Actions - Fixed */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b mb-4 flex-shrink-0">
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

        {/* Publish Actions - Top Right */}
        <div className="flex items-center gap-2">
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {createBlog.isPending ? "Creating..." : "Uploading Image..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {formData.status === "published" ? "Publish" : "Save Draft"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form - Scrollable Content */}
      <form onSubmit={handleSubmit} className="flex-1 ">
        <div className="mx-auto max-w-6xl pb-10">
          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-3 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  disabled={isSubmitting}
                  className={cn(
                    "text-lg",
                    errors.title ? "border-destructive" : "",
                  )}
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
                  disabled={isSubmitting}
                  className={errors.slug ? "border-destructive" : ""}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => {
                    setFormData((prev) => ({ ...prev, content }));
                    if (errors.content) {
                      setErrors((prev) => ({ ...prev, content: "" }));
                    }
                  }}
                  placeholder="Write your blog post content..."
                  disabled={isSubmitting}
                  className={errors.content ? "border-destructive" : ""}
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
                  disabled={isSubmitting}
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  A brief description shown in post listings
                </p>
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-4">
              {/* Category */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., News, Tutorial"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    <div
                      className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 cursor-pointer"
                      onClick={() =>
                        !isSubmitting && fileInputRef.current?.click()
                      }
                    >
                      {featuredImagePreview ? (
                        <>
                          <img
                            src={featuredImagePreview}
                            alt="Featured image preview"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            disabled={isSubmitting}
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">Click to upload</span>
                        </div>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {errors.featuredImage && (
                      <p className="text-sm text-destructive">
                        {errors.featuredImage}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, WebP or GIF. Max 5MB.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
