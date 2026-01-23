// Types for staff attendance

export type AttendanceStatus = 'pending' | 'approved' | 'rejected';

export interface Attendance {
    _id: string;
    staffId: string;
    businessId: string;
    clockIn: string;
    clockOut?: string;
    hoursWorked?: number;
    status: AttendanceStatus;
    notes?: string;
    adminNotes?: string;
    approvedBy?: string;
    approvedAt?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ClockInRequest {
    notes?: string;
}

export interface ClockOutRequest {
    notes?: string;
}

export interface ClockInResponse extends Attendance {
    message: string;
}

export interface ClockOutResponse extends Attendance {
    message: string;
    hoursWorked: number;
}

export interface AttendanceQuery {
    startDate?: string;
    endDate?: string;
    status?: AttendanceStatus;
}
