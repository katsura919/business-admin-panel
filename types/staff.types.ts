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
    salaryType?: 'hourly' | 'daily' | 'monthly' | 'annual';
    employmentType: 'full-time' | 'part-time' | 'contract';
    businessId: string;
    status: 'active' | 'on_leave' | 'terminated';
    notes?: string;
    photoUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StaffLoginResponse {
    token: string;
    staff: Staff;
}
