"use client";

import { useState, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Building2,
    Loader2,
    Upload,
    Globe,
    FileText,
    X,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
    useBusinessById,
    useUpdateBusiness,
    useUploadBusinessLogo,
} from "@/hooks/useBusiness";

const settingsNavItems = [
    {
        title: "Business",
        href: "",
        icon: Building2,
    },
];

export default function BusinessSettingsPage() {
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const businessId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: business, isLoading, isError } = useBusinessById(businessId);
    const updateBusiness = useUpdateBusiness();
    const uploadLogo = useUploadBusinessLogo();

    // Form state
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Initialize form when business data loads
    if (business && !isFormInitialized) {
        setName(business.name);
        setSlug(business.slug);
        setDescription(business.description || "");
        setWebsite(business.website || "");
        setIsActive(business.isActive);
        setIsFormInitialized(true);
    }

    const filteredNavItems = settingsNavItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewLogo(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        setPreviewLogo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Upload logo first if selected
        if (selectedFile) {
            await uploadLogo.mutateAsync({ id: businessId, file: selectedFile });
            clearSelectedFile();
        }

        // Update business info
        updateBusiness.mutate({
            id: businessId,
            data: {
                name,
                slug,
                description: description || undefined,
                website: website || undefined,
                isActive,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !business) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <Building2 className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Business Not Found</h3>
                <p className="mt-2 text-base text-muted-foreground">
                    The business you're looking for doesn't exist or you don't have access to it.
                </p>
            </div>
        );
    }

    const isSubmitting = updateBusiness.isPending || uploadLogo.isPending;
    const displayLogo = previewLogo || business.logo;
    const basePath = `/business/${businessId}/settings`;

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            {/* Sidebar */}
            <aside className="lg:w-56 shrink-0">
                <div className="sticky top-20 space-y-4">
                    {/* Settings Title */}
                    <h1 className="text-2xl font-semibold">Settings</h1>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-muted/30 border-muted"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-0.5">
                        {filteredNavItems.map((item) => {
                            const href = `${basePath}${item.href}`;
                            const isActive =
                                item.href === ""
                                    ? pathname === basePath
                                    : pathname === href || pathname.startsWith(href + "/");
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.title}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 space-y-6 max-w-3xl">
                {/* Business Logo Section */}
                <div className="rounded-lg border bg-card">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold">Business Logo</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Upload a logo for your business. Recommended size: 256x256px.
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start gap-6">
                            {/* Logo Preview */}
                            <div className="relative">
                                {displayLogo ? (
                                    <div className="relative h-24 w-24 overflow-hidden rounded-xl border">
                                        <Image
                                            src={displayLogo}
                                            alt={`${business.name} logo`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted border-2 border-dashed">
                                        <Building2 className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                                {selectedFile && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={clearSelectedFile}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 space-y-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {selectedFile ? "Change Image" : "Upload Logo"}
                                </Button>
                                {selectedFile && (
                                    <p className="text-sm text-muted-foreground">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Accepted formats: JPEG, PNG, WebP, GIF
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Information Section */}
                <div className="rounded-lg border bg-card">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold">Business Information</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Update your business details and settings.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="My Business"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                                    placeholder="my-business"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A short description of your business..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="isActive">Active Status</Label>
                                <p className="text-sm text-muted-foreground">
                                    {isActive ? "Business is visible and active." : "Business is hidden and inactive."}
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={isActive}
                                onCheckedChange={setIsActive}
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
