import api from "@/utils/api";
import type {
  Admin,
  CreateAdminRequest,
  UpdateAdminRequest,
  DeleteAdminResponse,
} from "@/types/admin.types";

// Get all admins (super-admin only)
export const getAllAdmins = async (): Promise<Admin[]> => {
  const response = await api.get<Admin[]>("/admin/admins");
  return response.data;
};

// Get admin by ID (super-admin only)
export const getAdminById = async (id: string): Promise<Admin> => {
  const response = await api.get<Admin>(`/admin/admins/${id}`);
  return response.data;
};

// Create admin (super-admin only, or first admin registration)
export const createAdmin = async (data: CreateAdminRequest): Promise<Admin> => {
  const response = await api.post<Admin>("/admin/register", data);
  return response.data;
};

// Update admin (super-admin only)
export const updateAdmin = async (
  id: string,
  data: UpdateAdminRequest,
): Promise<Admin> => {
  const response = await api.put<Admin>(`/admin/admins/${id}`, data);
  return response.data;
};

// Delete admin (soft delete, super-admin only)
export const deleteAdmin = async (id: string): Promise<DeleteAdminResponse> => {
  const response = await api.delete<DeleteAdminResponse>(`/admin/admins/${id}`);
  return response.data;
};
