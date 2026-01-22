"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    Upload,
    X,
    Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateBusiness, useUploadBusinessLogo } from "@/hooks/useBusiness";
import Link from "next/link";

export default function CreateBusinessPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { mutateAsync: createBusiness, isPending: isCreating } = useCreateBusiness();
    const { mutateAsync: uploadLogo, isPending: isUploading } = useUploadBusinessLogo();

    const isSubmitting = isCreating || isUploading;

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        setName(value);
        const generatedSlug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        setSlug(generatedSlug);
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                alert("Invalid file type. Please select a JPEG, PNG, WebP, or GIF image.");
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large. Maximum size is 5MB.");
                return;
            }

            setLogoFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    // Remove selected logo
    const handleRemoveLogo = () => {
        setLogoFile(null);
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !slug.trim()) return;

        try {
            // Step 1: Create the business
            const newBusiness = await createBusiness({
                name: name.trim(),
                slug: slug.trim(),
                description: description.trim() || undefined,
                website: website.trim() || undefined,
                isActive: true,
            });

            // Step 2: Upload logo if selected
            if (logoFile && newBusiness._id) {
                await uploadLogo({ id: newBusiness._id, file: logoFile });
            }

            // Navigate back to overview
            router.push("/overview");
        } catch (error) {
            // Error handling is done in the hooks
            console.error("Failed to create business:", error);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/overview">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Back to overview</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Business</h1>
                    <p className="text-sm text-muted-foreground">
                        Add a new business to manage its blog content and settings.
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Details</CardTitle>
                    <CardDescription>
                        Enter the basic information for your new business.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <Label>Business Logo</Label>
                            <div className="flex items-start gap-4">
                                {/* Logo Preview */}
                                <div
                                    className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {logoPreview ? (
                                        <>
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveLogo();
                                                }}
                                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSubmitting}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {logoFile ? "Change Logo" : "Upload Logo"}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        JPEG, PNG, WebP or GIF. Max 5MB.
                                    </p>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Business Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Business Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Tech Solutions Inc"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="slug"
                                placeholder="e.g., tech-solutions-inc"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                URL-friendly identifier for the business
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of your business..."
                                value={description}
                                onChange={(e: any) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                rows={4}
                            />
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://example.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/overview")}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !name.trim() || !slug.trim()}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isCreating ? "Creating..." : isUploading ? "Uploading Logo..." : "Create Business"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
