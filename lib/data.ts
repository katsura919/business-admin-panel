// Dummy data for UI development

export interface Business {
    id: string;
    name: string;
    description: string;
    blogCount: number;
    createdAt: string;
    logo?: string;
}

export const businesses: Business[] = [
    {
        id: "1",
        name: "Tech Solutions Inc",
        description: "A leading technology consulting firm specializing in digital transformation and cloud solutions.",
        blogCount: 8,
        createdAt: "2024-12-15",
    },
    {
        id: "2",
        name: "Cafe Corner",
        description: "Artisanal coffee shop with locally sourced beans and homemade pastries.",
        blogCount: 5,
        createdAt: "2024-11-28",
    },
    {
        id: "3",
        name: "Fitness Pro Gym",
        description: "State-of-the-art fitness center with personal training and group classes.",
        blogCount: 12,
        createdAt: "2024-10-05",
    },
    {
        id: "4",
        name: "Urban Dental Clinic",
        description: "Modern dental practice offering comprehensive oral health services.",
        blogCount: 3,
        createdAt: "2025-01-02",
    },
];

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export const currentUser: User = {
    id: "1",
    name: "John Admin",
    email: "john@admin.com",
};
