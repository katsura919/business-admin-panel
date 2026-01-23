import api from "@/utils/api";
import type {
  Blog,
  BlogListResponse,
  BlogQueryParams,
  CreateBlogRequest,
  UpdateBlogRequest,
  DeleteBlogResponse,
  UploadFeaturedImageResponse,
} from "@/types/blog.types";

// Get all blogs (with optional filters)
export const getAllBlogs = async (params?: {
  businessId?: string;
  status?: string;
}): Promise<Blog[]> => {
  const response = await api.get<Blog[]>("/blogs", { params });
  return response.data;
};

// Get blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  const response = await api.get<Blog>(`/blogs/${id}`);
  return response.data;
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await api.get<Blog>(`/blogs/slug/${slug}`);
  return response.data;
};

// Get blogs by business ID with search, pagination, and filtering
export const getBlogsByBusiness = async (
  businessId: string,
  params?: BlogQueryParams,
): Promise<BlogListResponse> => {
  const response = await api.get<BlogListResponse>(
    `/businesses/${businessId}/blogs`,
    {
      params: {
        search: params?.search || undefined,
        page: params?.page?.toString() || "1",
        limit: params?.limit?.toString() || "10",
        status: params?.status || "all",
      },
    },
  );
  return response.data;
};

// Create blog
export const createBlog = async (data: CreateBlogRequest): Promise<Blog> => {
  const response = await api.post<Blog>("/blogs", data);
  return response.data;
};

// Update blog
export const updateBlog = async (
  id: string,
  data: UpdateBlogRequest,
): Promise<Blog> => {
  const response = await api.put<Blog>(`/blogs/${id}`, data);
  return response.data;
};

// Delete blog (soft delete)
export const deleteBlog = async (id: string): Promise<DeleteBlogResponse> => {
  const response = await api.delete<DeleteBlogResponse>(`/blogs/${id}`);
  return response.data;
};

// Upload blog featured image
export const uploadBlogFeaturedImage = async (
  id: string,
  file: File,
): Promise<UploadFeaturedImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadFeaturedImageResponse>(
    `/blogs/${id}/featured-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
