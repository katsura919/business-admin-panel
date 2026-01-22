import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Staff } from "@/types/staff.types";

interface StaffState {
    staff: Staff | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setStaff: (staff: Staff) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;

    // Helpers
    getFullName: () => string;
    getInitials: () => string;
    getBusinessId: () => string | null;
}

export const useStaffStore = create<StaffState>()(
    persist(
        (set, get) => ({
            staff: null,
            isAuthenticated: false,
            isLoading: false,

            setStaff: (staff) => set({ staff, isAuthenticated: true }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () => {
                // Clear cookie
                if (typeof window !== "undefined") {
                    document.cookie =
                        "staff_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
                set({ staff: null, isAuthenticated: false });
            },

            // Get full name of current staff
            getFullName: () => {
                const { staff } = get();
                if (!staff) return "";
                return `${staff.firstName} ${staff.lastName}`;
            },

            // Get initials for avatar
            getInitials: () => {
                const { staff } = get();
                if (!staff) return "";
                return `${staff.firstName[0] || ""}${staff.lastName[0] || ""}`.toUpperCase();
            },

            // Get business ID of current staff
            getBusinessId: () => {
                const { staff } = get();
                return staff?.businessId ?? null;
            },
        }),
        {
            name: "staff-storage",
            partialize: (state) => ({
                staff: state.staff,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);
