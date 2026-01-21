import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/api/admin/admin";
import type {
  Admin,
  CreateAdminRequest,
  UpdateAdminRequest,
} from "@/types/admin.types";

interface ApiError {
  error?: string;
  message?: string;
}

// Get all admins (super-admin only)
export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: getAllAdmins,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get admin by ID (super-admin only)
export const useAdminById = (id: string) => {
  return useQuery({
    queryKey: ["admins", id],
    queryFn: () => getAdminById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create admin (super-admin only)
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => createAdmin(data),
    onSuccess: (newAdmin) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin created!", {
        description: `${newAdmin.firstName} ${newAdmin.lastName} has been added as ${newAdmin.role}.`,
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create admin";
      toast.error("Creation failed", {
        description: message,
      });
    },
  });
};

// Update admin (super-admin only)
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminRequest }) =>
      updateAdmin(id, data),
    onSuccess: (updatedAdmin) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admins", updatedAdmin._id] });
      toast.success("Admin updated!", {
        description: `${updatedAdmin.firstName} ${updatedAdmin.lastName} has been updated.`,
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update admin";
      toast.error("Update failed", {
        description: message,
      });
    },
  });
};

// Delete admin (super-admin only)
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deleted", {
        description: "The admin has been deactivated successfully.",
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete admin";
      toast.error("Deletion failed", {
        description: message,
      });
    },
  });
};
