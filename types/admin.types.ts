// Admin roles
export type AdminRole = "super-admin" | "admin";

export interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  businessIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// For creating a new admin (super-admin only)
export interface CreateAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: AdminRole;
  businessIds?: string[];
}

// For updating an admin (super-admin only)
export interface UpdateAdminRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  businessIds?: string[];
  isActive?: boolean;
}

// Response for delete operation
export interface DeleteAdminResponse {
  message: string;
}
