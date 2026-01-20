import api from '@/utils/api';
import type {
    Business,
    CreateBusinessRequest,
    UpdateBusinessRequest,
    DeleteBusinessResponse,
} from '@/types/business.types';

// Get all businesses
export const getAllBusinesses = async (): Promise<Business[]> => {
    const response = await api.get<Business[]>('/businesses');
    return response.data;
};

// Get business by ID
export const getBusinessById = async (id: string): Promise<Business> => {
    const response = await api.get<Business>(`/businesses/${id}`);
    return response.data;
};

// Get business by slug
export const getBusinessBySlug = async (slug: string): Promise<Business> => {
    const response = await api.get<Business>(`/businesses/slug/${slug}`);
    return response.data;
};

// Create business
export const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
    const response = await api.post<Business>('/businesses', data);
    return response.data;
};

// Update business
export const updateBusiness = async (id: string, data: UpdateBusinessRequest): Promise<Business> => {
    const response = await api.put<Business>(`/businesses/${id}`, data);
    return response.data;
};

// Delete business (soft delete)
export const deleteBusiness = async (id: string): Promise<DeleteBusinessResponse> => {
    const response = await api.delete<DeleteBusinessResponse>(`/businesses/${id}`);
    return response.data;
};
