import api from "@/utils/api";
import type {
  Staff,
  StaffListResponse,
  StaffQueryParams,
  CreateStaffRequest,
  UpdateStaffRequest,
  DeleteStaffResponse,
  UploadPhotoResponse,
  UploadDocumentResponse,
} from "@/types/staff.types";

// Get staff by business with search and pagination
export const getStaffByBusiness = async (
  businessId: string,
  params?: StaffQueryParams,
): Promise<StaffListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.search) queryParams.append("search", params.search);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.employmentType)
    queryParams.append("employmentType", params.employmentType);

  const queryString = queryParams.toString();
  const url = `/businesses/${businessId}/staff${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<StaffListResponse>(url);
  return response.data;
};

// Get staff by ID
export const getStaffById = async (id: string): Promise<Staff> => {
  const response = await api.get<Staff>(`/staff/${id}`);
  return response.data;
};

// Create staff member
export const createStaff = async (data: CreateStaffRequest): Promise<Staff> => {
  const response = await api.post<Staff>("/staff", data);
  return response.data;
};

// Update staff member
export const updateStaff = async (
  id: string,
  data: UpdateStaffRequest,
): Promise<Staff> => {
  const response = await api.put<Staff>(`/staff/${id}`, data);
  return response.data;
};

// Delete staff member (soft delete)
export const deleteStaff = async (id: string): Promise<DeleteStaffResponse> => {
  const response = await api.delete<DeleteStaffResponse>(`/staff/${id}`);
  return response.data;
};

// Upload staff photo
export const uploadStaffPhoto = async (
  id: string,
  file: File,
): Promise<UploadPhotoResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadPhotoResponse>(
    `/staff/${id}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

// Upload staff document
export const uploadStaffDocument = async (
  id: string,
  file: File,
): Promise<UploadDocumentResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadDocumentResponse>(
    `/staff/${id}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
