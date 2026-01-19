import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add bearer token
api.interceptors.request.use(
    (config) => {
        // Get token from cookies (client-side)
        if (typeof window !== 'undefined') {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_token='))
                ?.split('=')[1];

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
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            if (typeof window !== 'undefined') {
                document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
