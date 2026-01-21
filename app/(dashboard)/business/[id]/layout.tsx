"use client";

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout exists for route grouping - business pages use props from the page
    return <>{children}</>;
}
