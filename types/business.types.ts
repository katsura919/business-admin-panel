// Business types matching backend API

export interface Business {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBusinessRequest {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    isActive?: boolean;
}

export interface UpdateBusinessRequest {
    name?: string;
    slug?: string;
    description?: string;
    logo?: string;
    website?: string;
    isActive?: boolean;
}

export interface DeleteBusinessResponse {
    message: string;
}
