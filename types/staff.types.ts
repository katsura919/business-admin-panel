// Types for staff auth
export interface StaffLoginRequest {
  email: string;
  password: string;
}

export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  dateHired: string;
  salary?: number;
  salaryType?: "hourly" | "daily" | "monthly" | "annual";
  employmentType: "full-time" | "part-time" | "contract";
  businessId: string;
  status: "active" | "on_leave" | "terminated";
  notes?: string;
  photoUrl?: string;
  documents?: StaffDocument[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffDocument {
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface StaffLoginResponse {
  token: string;
  staff: Staff;
}

// Pagination types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface StaffListResponse {
  data: Staff[];
  pagination: PaginationInfo;
}

// Query params for fetching staff
export interface StaffQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: "active" | "on_leave" | "terminated";
  employmentType?: "full-time" | "part-time" | "contract";
}

// Create staff request
export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  position: string;
  department?: string;
  dateHired: string;
  salary?: number;
  salaryType?: "hourly" | "daily" | "monthly" | "annual";
  employmentType?: "full-time" | "part-time" | "contract";
  businessId: string;
}

// Update staff request
export interface UpdateStaffRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  dateHired?: string;
  salary?: number;
  salaryType?: "hourly" | "daily" | "monthly" | "annual";
  employmentType?: "full-time" | "part-time" | "contract";
  status?: "active" | "on_leave" | "terminated";
  notes?: string;
}

// Response types
export interface DeleteStaffResponse {
  message: string;
}

export interface UploadPhotoResponse {
  message: string;
  photoUrl: string;
  staff: Staff;
}

export interface UploadDocumentResponse {
  message: string;
  document: StaffDocument;
  staff: Staff;
}
