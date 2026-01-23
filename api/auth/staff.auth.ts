import api, { setAuthToken } from '@/utils/api';
import type { StaffLoginRequest, StaffLoginResponse, Staff } from '@/types/staff.types';

// Re-export for backward compatibility (alias)
export const setStaffAuthToken = setAuthToken;

// API functions
export const loginStaff = async (data: StaffLoginRequest): Promise<StaffLoginResponse> => {
    const response = await api.post<StaffLoginResponse>('/staff/login', data);
    return response.data;
};

export const getCurrentStaff = async (): Promise<Staff> => {
    const response = await api.get<Staff>('/staff/me');
    return response.data;
};
