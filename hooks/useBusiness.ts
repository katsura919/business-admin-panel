import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import {
    getAllBusinesses,
    getBusinessById,
    getBusinessBySlug,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    uploadBusinessLogo,
} from '@/api/business/business';
import type {
    Business,
    CreateBusinessRequest,
    UpdateBusinessRequest,
} from '@/types/business.types';

interface ApiError {
    error?: string;
    message?: string;
}

// Get all businesses
export const useBusinesses = () => {
    return useQuery({
        queryKey: ['businesses'],
        queryFn: getAllBusinesses,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get business by ID
export const useBusinessById = (id: string) => {
    return useQuery({
        queryKey: ['businesses', id],
        queryFn: () => getBusinessById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Get business by slug
export const useBusinessBySlug = (slug: string) => {
    return useQuery({
        queryKey: ['businesses', 'slug', slug],
        queryFn: () => getBusinessBySlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
};

// Create business
export const useCreateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBusinessRequest) => createBusiness(data),
        onSuccess: (newBusiness) => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            toast.success('Business created!', {
                description: `${newBusiness.name} has been created successfully.`,
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to create business';
            toast.error('Creation failed', {
                description: message,
            });
        },
    });
};

// Update business
export const useUpdateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBusinessRequest }) => updateBusiness(id, data),
        onSuccess: (updatedBusiness) => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['businesses', updatedBusiness._id] });
            toast.success('Business updated!', {
                description: `${updatedBusiness.name} has been updated successfully.`,
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to update business';
            toast.error('Update failed', {
                description: message,
            });
        },
    });
};

// Delete business
export const useDeleteBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBusiness(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            toast.success('Business deleted!', {
                description: 'The business has been deleted successfully.',
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to delete business';
            toast.error('Deletion failed', {
                description: message,
            });
        },
    });
};

// Upload business logo
export const useUploadBusinessLogo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) => uploadBusinessLogo(id, file),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['businesses', response.business._id] });
            toast.success('Logo uploaded!', {
                description: 'Business logo has been updated successfully.',
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to upload logo';
            toast.error('Upload failed', {
                description: message,
            });
        },
    });
};
