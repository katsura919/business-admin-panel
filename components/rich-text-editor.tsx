"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Unlink,
    Heading1,
    Heading2,
    Heading3,
    Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = "Start writing...",
    disabled = false,
    className,
}: RichTextEditorProps) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editable: !disabled,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-3 py-2",
            },
        },
    });

    const openLinkDialog = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes("link").href || "";
        setLinkUrl(previousUrl);
        setLinkDialogOpen(true);
    }, [editor]);

    const handleSetLink = useCallback(() => {
        if (!editor) return;

        if (linkUrl === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            let finalUrl = linkUrl;
            if (!/^https?:\/\//i.test(linkUrl) && !/^mailto:/i.test(linkUrl)) {
                finalUrl = `https://${linkUrl}`;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
        }

        setLinkDialogOpen(false);
        setLinkUrl("");
    }, [editor, linkUrl]);

    if (!editor) {
        return null;
    }

    // Toolbar button with tooltip wrapper
    const ToolbarButton = ({
        onClick,
        disabled: btnDisabled,
        active,
        tooltip,
        children,
    }: {
        onClick: () => void;
        disabled?: boolean;
        active?: boolean;
        tooltip: string;
        children: React.ReactNode;
    }) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant={active ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={onClick}
                    disabled={btnDisabled}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );

    // Toolbar toggle with tooltip wrapper
    const ToolbarToggle = ({
        pressed,
        onPressedChange,
        disabled: toggleDisabled,
        tooltip,
        children,
    }: {
        pressed: boolean;
        onPressedChange: () => void;
        disabled?: boolean;
        tooltip: string;
        children: React.ReactNode;
    }) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    pressed={pressed}
                    onPressedChange={onPressedChange}
                    disabled={toggleDisabled}
                    className="h-8 w-8 p-0"
                >
                    {children}
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );

    return (
        <TooltipProvider delayDuration={300}>
            <div className={cn("rounded-md border bg-background", className)}>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
                    {/* Undo/Redo */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo() || disabled}
                        tooltip="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo() || disabled}
                        tooltip="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Headings */}
                    <ToolbarToggle
                        pressed={editor.isActive("heading", { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        disabled={disabled}
                        tooltip="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </ToolbarToggle>
                    <ToolbarToggle
                        pressed={editor.isActive("heading", { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        disabled={disabled}
                        tooltip="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </ToolbarToggle>
                    <ToolbarToggle
                        pressed={editor.isActive("heading", { level: 3 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        disabled={disabled}
                        tooltip="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </ToolbarToggle>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Text Formatting */}
                    <ToolbarToggle
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        disabled={disabled}
                        tooltip="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </ToolbarToggle>
                    <ToolbarToggle
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        disabled={disabled}
                        tooltip="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </ToolbarToggle>
                    <ToolbarToggle
                        pressed={editor.isActive("strike")}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                        disabled={disabled}
                        tooltip="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </ToolbarToggle>
                    <ToolbarToggle
                        pressed={editor.isActive("code")}
                        onPressedChange={() => editor.chain().focus().toggleCode().run()}
                        disabled={disabled}
                        tooltip="Inline Code"
                    >
                        <Code className="h-4 w-4" />
                    </ToolbarToggle>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Lists */}
                    <ToolbarToggle
                        pressed={editor.isActive("bulletList")}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        disabled={disabled}
                        tooltip="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </ToolbarToggle>
                    <ToolbarToggle
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        disabled={disabled}
                        tooltip="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </ToolbarToggle>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Block Elements */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        disabled={disabled}
                        active={editor.isActive("blockquote")}
                        tooltip="Blockquote"
                    >
                        <Quote className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        disabled={disabled}
                        tooltip="Horizontal Rule"
                    >
                        <Minus className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Links */}
                    <ToolbarButton
                        onClick={openLinkDialog}
                        disabled={disabled}
                        active={editor.isActive("link")}
                        tooltip="Insert Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </ToolbarButton>
                    {editor.isActive("link") && (
                        <ToolbarButton
                            onClick={() => editor.chain().focus().unsetLink().run()}
                            disabled={disabled}
                            tooltip="Remove Link"
                        >
                            <Unlink className="h-4 w-4" />
                        </ToolbarButton>
                    )}
                </div>

                {/* Editor Content */}
                <EditorContent editor={editor} />

                {/* Link Dialog */}
                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Insert Link</DialogTitle>
                            <DialogDescription>
                                Enter the URL for the link. It will automatically add https:// if no protocol is specified.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSetLink();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSetLink}>
                                {linkUrl ? "Apply Link" : "Remove Link"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
