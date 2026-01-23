import api, { setAuthToken } from '@/utils/api';
import type { Admin } from '@/types/admin.types';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth.types';

// Re-export for backward compatibility
export { setAuthToken };

// API functions
export const loginAdmin = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/admin/login', data);
    return response.data;
};

export const registerAdmin = async (data: RegisterRequest): Promise<Admin> => {
    const response = await api.post<Admin>('/admin/register', data);
    return response.data;
};

export const getCurrentAdmin = async (): Promise<Admin> => {
    const response = await api.get<Admin>('/admin/me');
    return response.data;
};
