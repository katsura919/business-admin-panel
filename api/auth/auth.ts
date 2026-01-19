import api from '@/utils/api';
import type { Admin } from '@/types/admin.types';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth.types';


// Cookie helper - set token in cookies
export const setAuthToken = (token: string) => {
    // Set cookie with 7 days expiry
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `admin_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

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
