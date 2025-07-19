import axios from "axios";
import { refreshTokenAction } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // This will be handled differently in server actions vs client
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResult = await refreshTokenAction();

                if (refreshResult.success) {
                    // Retry original request with new token
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Server-side API client (for server actions)
export const serverApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to server requests
export const createAuthedServerApi = (token: string) => {
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

// Client-side API client (for client components)
export const clientApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token interceptor for client-side requests
clientApi.interceptors.request.use(
    (config) => {
        // Token will be handled by server actions or client-side auth
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;