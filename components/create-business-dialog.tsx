"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBusiness } from "@/hooks/useBusiness";

interface CreateBusinessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateBusinessDialog({ open, onOpenChange }: CreateBusinessDialogProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");

    const { mutate: createBusiness, isPending } = useCreateBusiness();

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        setName(value);
        // Only auto-generate slug if user hasn't manually edited it
        const generatedSlug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        setSlug(generatedSlug);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !slug.trim()) return;

        createBusiness(
            {
                name: name.trim(),
                slug: slug.trim(),
                description: description.trim() || undefined,
                website: website.trim() || undefined,
                isActive: true,
            },
            {
                onSuccess: () => {
                    // Reset form and close dialog
                    setName("");
                    setSlug("");
                    setDescription("");
                    setWebsite("");
                    onOpenChange(false);
                },
            }
        );
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Reset form when closing
            setName("");
            setSlug("");
            setDescription("");
            setWebsite("");
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Business</DialogTitle>
                        <DialogDescription>
                            Add a new business to manage its blog content and settings.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Business Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Tech Solutions Inc"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                disabled={isPending}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="slug"
                                placeholder="e.g., tech-solutions-inc"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                disabled={isPending}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly identifier for the business
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of your business..."
                                value={description}
                                onChange={(e:any) => setDescription(e.target.value)}
                                disabled={isPending}
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://example.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !name.trim() || !slug.trim()}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Business
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
