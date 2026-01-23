// Blog types matching backend API

export type BlogStatus = "draft" | "published";

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

export interface BlogPaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogListResponse {
  data: Blog[];
  pagination: BlogPaginationInfo;
}

export interface BlogQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "all";
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

export interface UploadFeaturedImageResponse {
  message: string;
  featuredImage: string;
  blog: Blog;
}
