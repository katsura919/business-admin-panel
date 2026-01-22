import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import {
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    getBlogsByBusiness,
    createBlog,
    updateBlog,
    deleteBlog,
    uploadBlogFeaturedImage,
} from '@/api/blog/blog';
import type {
    Blog,
    CreateBlogRequest,
    UpdateBlogRequest,
} from '@/types/blog.types';

interface ApiError {
    error?: string;
    message?: string;
}

// Get all blogs
export const useBlogs = (params?: { businessId?: string; status?: string }) => {
    return useQuery({
        queryKey: ['blogs', params],
        queryFn: () => getAllBlogs(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get blogs by business ID
export const useBlogsByBusiness = (businessId: string) => {
    return useQuery({
        queryKey: ['blogs', 'business', businessId],
        queryFn: () => getBlogsByBusiness(businessId),
        enabled: !!businessId,
        staleTime: 5 * 60 * 1000,
    });
};

// Get blog by ID
export const useBlogById = (id: string) => {
    return useQuery({
        queryKey: ['blogs', id],
        queryFn: () => getBlogById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Get blog by slug
export const useBlogBySlug = (slug: string) => {
    return useQuery({
        queryKey: ['blogs', 'slug', slug],
        queryFn: () => getBlogBySlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
};

// Create blog
export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBlogRequest) => createBlog(data),
        onSuccess: (newBlog) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            toast.success('Blog created!', {
                description: `"${newBlog.title}" has been created successfully.`,
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to create blog';
            toast.error('Creation failed', {
                description: message,
            });
        },
    });
};

// Update blog
export const useUpdateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBlogRequest }) => updateBlog(id, data),
        onSuccess: (updatedBlog) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['blogs', updatedBlog._id] });
            toast.success('Blog updated!', {
                description: `"${updatedBlog.title}" has been updated successfully.`,
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to update blog';
            toast.error('Update failed', {
                description: message,
            });
        },
    });
};

// Delete blog
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            toast.success('Blog deleted!', {
                description: 'The blog has been deleted successfully.',
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to delete blog';
            toast.error('Deletion failed', {
                description: message,
            });
        },
    });
};

// Upload blog featured image
export const useUploadBlogFeaturedImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) => uploadBlogFeaturedImage(id, file),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['blogs', response.blog._id] });
            toast.success('Featured image uploaded!', {
                description: 'Blog featured image has been updated successfully.',
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to upload featured image';
            toast.error('Upload failed', {
                description: message,
            });
        },
    });
};
