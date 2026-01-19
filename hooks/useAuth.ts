import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginAdmin, registerAdmin, getCurrentAdmin, setAuthToken } from '@/api/auth/auth';
import type { LoginRequest, RegisterRequest } from '@/types/auth.types';
import { useAdminStore } from '@/store/admin.store';
import { AxiosError } from 'axios';

interface ApiError {
    error?: string;
    message?: string;
}

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setAdmin, setLoading } = useAdminStore();

    return useMutation({
        mutationFn: (data: LoginRequest) => loginAdmin(data),
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            // Save token in cookie
            setAuthToken(data.token);
            // Update zustand store
            setAdmin(data.admin);
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['admin', 'me'] });
            // Show success toast
            toast.success('Welcome back!', {
                description: `Logged in as ${data.admin.firstName} ${data.admin.lastName}`,
            });
            // Redirect to dashboard
            router.push('/overview');
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

export const useRegister = () => {
    const router = useRouter();
    const { setLoading } = useAdminStore();

    return useMutation({
        mutationFn: (data: RegisterRequest) => registerAdmin(data),
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: () => {
            toast.success('Registration successful!', {
                description: 'You can now sign in with your credentials.',
            });
            // Redirect to login after registration
            router.push('/login');
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
            toast.error('Registration failed', {
                description: message,
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};

export const useCurrentAdmin = () => {
    return useQuery({
        queryKey: ['admin', 'me'],
        queryFn: getCurrentAdmin,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { logout } = useAdminStore();

    return () => {
        logout();
        queryClient.clear();
        toast.success('Logged out', {
            description: 'You have been signed out successfully.',
        });
        router.push('/login');
    };
};
