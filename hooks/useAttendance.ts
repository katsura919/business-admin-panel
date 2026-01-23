import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clockIn, clockOut, getMyAttendance } from '@/api/attendance/attendance';
import type { ClockInRequest, ClockOutRequest, AttendanceQuery } from '@/types/attendance.types';
import { AxiosError } from 'axios';

interface ApiError {
    error?: string;
    message?: string;
}

// Hook to get current attendance status (check if clocked in)
export const useMyAttendance = (query?: AttendanceQuery) => {
    return useQuery({
        queryKey: ['attendance', 'me', query],
        queryFn: () => getMyAttendance(query),
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Hook to check if staff is currently clocked in
export const useCurrentClockIn = () => {
    return useQuery({
        queryKey: ['attendance', 'current'],
        queryFn: async () => {
            const records = await getMyAttendance();
            // Find record with no clock out time (currently clocked in)
            return records.find(record => !record.clockOut) || null;
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Refetch every minute
    });
};

// Hook to clock in
export const useClockIn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data?: ClockInRequest) => clockIn(data),
        onSuccess: (data) => {
            toast.success('Clocked In!', {
                description: `You clocked in at ${new Date(data.clockIn).toLocaleTimeString()}`,
            });
            // Invalidate attendance queries to refetch
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to clock in';
            toast.error('Clock In Failed', {
                description: message,
            });
        },
    });
};

// Hook to clock out
export const useClockOut = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data?: ClockOutRequest) => clockOut(data),
        onSuccess: (data) => {
            const hours = data.hoursWorked;
            const hoursText = hours >= 1
                ? `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`
                : `${Math.round(hours * 60)}m`;

            toast.success('Clocked Out!', {
                description: `You worked ${hoursText} today`,
            });
            // Invalidate attendance queries to refetch
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to clock out';
            toast.error('Clock Out Failed', {
                description: message,
            });
        },
    });
};
