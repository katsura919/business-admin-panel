// Blog types matching backend API

export type BlogStatus = 'draft' | 'published';

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    businessId: string;
    authorId: string;
    status: BlogStatus;
    publishedAt?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogRequest {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    businessId: string;
    status?: BlogStatus;
    isActive?: boolean;
}

export interface UpdateBlogRequest {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featuredImage?: string;
    status?: BlogStatus;
    isActive?: boolean;
}

export interface DeleteBlogResponse {
    message: string;
}
