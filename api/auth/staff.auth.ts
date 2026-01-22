import api from '@/utils/api';
import type { StaffLoginRequest, StaffLoginResponse, Staff } from '@/types/staff.types';

// Cookie helper - set staff token in cookies
export const setStaffAuthToken = (token: string) => {
    // Set cookie with 7 days expiry
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `staff_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

// API functions
export const loginStaff = async (data: StaffLoginRequest): Promise<StaffLoginResponse> => {
    const response = await api.post<StaffLoginResponse>('/staff/login', data);
    return response.data;
};

export const getCurrentStaff = async (): Promise<Staff> => {
    const response = await api.get<Staff>('/staff/me');
    return response.data;
};
