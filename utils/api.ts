import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get cookie value
const getCookie = (name: string): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1];
};

// Helper to set cookie
export const setAuthToken = (token: string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `auth_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

// Helper to clear auth token
export const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
};

// Request interceptor to add bearer token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = getCookie('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect on 401 for auth endpoints
        const isAuthEndpoint = error.config?.url?.includes('/admin/login') ||
            error.config?.url?.includes('/admin/register') ||
            error.config?.url?.includes('/staff/login');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            if (typeof window !== 'undefined') {
                clearAuthToken();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
