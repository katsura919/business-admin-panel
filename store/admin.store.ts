import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin } from '@/types/admin.types';

interface AdminState {
    admin: Admin | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAdmin: (admin: Admin) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            admin: null,
            isAuthenticated: false,
            isLoading: false,

            setAdmin: (admin) => set({ admin, isAuthenticated: true }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () => {
                // Clear cookie
                if (typeof window !== 'undefined') {
                    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                }
                set({ admin: null, isAuthenticated: false });
            },
        }),
        {
            name: 'admin-storage',
            partialize: (state) => ({ admin: state.admin, isAuthenticated: state.isAuthenticated }),
        }
    )
);
