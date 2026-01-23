import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  getStaffByBusiness,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  uploadStaffPhoto,
  uploadStaffDocument,
} from "@/api/staff/staff";
import type {
  StaffQueryParams,
  CreateStaffRequest,
  UpdateStaffRequest,
} from "@/types/staff.types";

interface ApiError {
  error?: string;
  message?: string;
}

// Get staff by business with search and pagination
export const useStaffByBusiness = (
  businessId: string,
  params?: StaffQueryParams,
) => {
  return useQuery({
    queryKey: ["staff", "business", businessId, params],
    queryFn: () => getStaffByBusiness(businessId, params),
    enabled: !!businessId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get staff by ID
export const useStaffById = (id: string) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => getStaffById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create staff member
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffRequest) => createStaff(data),
    onSuccess: (newStaff) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "business", newStaff.businessId],
      });
      toast.success("Staff member created!", {
        description: `${newStaff.firstName} ${newStaff.lastName} has been added successfully.`,
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create staff member";
      toast.error("Creation failed", {
        description: message,
      });
    },
  });
};

// Update staff member
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) =>
      updateStaff(id, data),
    onSuccess: (updatedStaff) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "business", updatedStaff.businessId],
      });
      queryClient.invalidateQueries({ queryKey: ["staff", updatedStaff._id] });
      toast.success("Staff member updated!", {
        description: `${updatedStaff.firstName} ${updatedStaff.lastName} has been updated successfully.`,
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update staff member";
      toast.error("Update failed", {
        description: message,
      });
    },
  });
};

// Delete staff member
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, businessId }: { id: string; businessId: string }) =>
      deleteStaff(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "business", variables.businessId],
      });
      toast.success("Staff member deleted!", {
        description: "The staff member has been removed successfully.",
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete staff member";
      toast.error("Deletion failed", {
        description: message,
      });
    },
  });
};

// Upload staff photo
export const useUploadStaffPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadStaffPhoto(id, file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "business", result.staff.businessId],
      });
      queryClient.invalidateQueries({ queryKey: ["staff", result.staff._id] });
      toast.success("Photo uploaded!", {
        description: "Staff photo has been updated successfully.",
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to upload photo";
      toast.error("Upload failed", {
        description: message,
      });
    },
  });
};

// Upload staff document
export const useUploadStaffDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadStaffDocument(id, file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "business", result.staff.businessId],
      });
      queryClient.invalidateQueries({ queryKey: ["staff", result.staff._id] });
      toast.success("Document uploaded!", {
        description: `${result.document.name} has been uploaded successfully.`,
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to upload document";
      toast.error("Upload failed", {
        description: message,
      });
    },
  });
};
