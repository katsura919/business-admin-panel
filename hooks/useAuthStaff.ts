import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginStaff, getCurrentStaff, setStaffAuthToken } from '@/api/auth/staff.auth';
import type { StaffLoginRequest } from '@/types/staff.types';
import { useStaffStore } from '@/store/staff.store';
import { AxiosError } from 'axios';

interface ApiError {
    error?: string;
    message?: string;
}

export const useStaffLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setStaff, setLoading } = useStaffStore();

    return useMutation({
        mutationFn: (data: StaffLoginRequest) => loginStaff(data),
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            // Save token in cookie
            setStaffAuthToken(data.token);
            // Update zustand store
            setStaff(data.staff);
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['staff', 'me'] });
            // Show success toast
            toast.success('Welcome back!', {
                description: `Logged in as ${data.staff.firstName} ${data.staff.lastName}`,
            });
            // Redirect to staff dashboard
            router.push('/dashboard');
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Invalid email or password';
            toast.error('Login failed', {
                description: message,
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};

export const useCurrentStaff = () => {
    return useQuery({
        queryKey: ['staff', 'me'],
        queryFn: getCurrentStaff,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useStaffLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { logout } = useStaffStore();

    return () => {
        logout();
        queryClient.clear();
        toast.success('Logged out', {
            description: 'You have been signed out successfully.',
        });
        router.push('/login');
    };
};
