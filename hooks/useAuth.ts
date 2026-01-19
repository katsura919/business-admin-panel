import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { loginAdmin, registerAdmin, getCurrentAdmin, setAuthToken } from '@/api/auth/auth';
import type { LoginRequest, RegisterRequest } from '@/types/auth.types';
import { useAdminStore } from '@/store/admin.store';

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
            // Redirect to dashboard
            router.push('/overview');
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
            // Redirect to login after registration
            router.push('/login');
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};

export const useCurrentAdmin = () => {
    const { setAdmin, logout } = useAdminStore();

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
        router.push('/login');
    };
};
