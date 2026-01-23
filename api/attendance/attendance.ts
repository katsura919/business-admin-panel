import api from '@/utils/api';
import type {
    Attendance,
    ClockInRequest,
    ClockOutRequest,
    ClockInResponse,
    ClockOutResponse,
    AttendanceQuery,
} from '@/types/attendance.types';

// Staff clock in
export const clockIn = async (data?: ClockInRequest): Promise<ClockInResponse> => {
    const response = await api.post<ClockInResponse>('/attendance/clock-in', data || {});
    return response.data;
};

// Staff clock out
export const clockOut = async (data?: ClockOutRequest): Promise<ClockOutResponse> => {
    const response = await api.post<ClockOutResponse>('/attendance/clock-out', data || {});
    return response.data;
};

// Get my attendance records (staff only)
export const getMyAttendance = async (query?: AttendanceQuery): Promise<Attendance[]> => {
    const params = new URLSearchParams();
    if (query?.startDate) params.append('startDate', query.startDate);
    if (query?.endDate) params.append('endDate', query.endDate);
    if (query?.status) params.append('status', query.status);

    const queryString = params.toString();
    const url = queryString ? `/attendance/me?${queryString}` : '/attendance/me';

    const response = await api.get<Attendance[]>(url);
    return response.data;
};
