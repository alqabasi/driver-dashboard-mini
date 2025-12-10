import axios, { AxiosInstance, AxiosError } from 'axios';
import { LoginRequest, LoginResponse, User, CreateUserRequest } from '../types';

// In a real app, this would be process.env.REACT_APP_API_URL
// Defaulting to a placeholder for demonstration purposes.
const API_URL = 'http://localhost:3000/api/v1';
// const API_URL = 'https://driver-api-mini-production.up.railway.app/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (like 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Auto-logout if token is invalid
      localStorage.removeItem('authToken');
      // We might want to trigger a redirect here via window or a global event
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      return response.data;
    },
  },
  admin: {
    getUsers: async (): Promise<User[]> => {
      const response = await apiClient.get<User[]>('/admin/users');
      return response.data;
    },
    createUser: async (data: CreateUserRequest): Promise<User> => {
      const response = await apiClient.post<User>('/auth/register', data);
      console.log(response, data)
      return response.data;
    },
    updateUser: async (id: string, data: Partial<User>): Promise<User> => {
      const response = await apiClient.put<User>(`/admin/users/${id}`, data);
      return response.data;
    },
    activateUser: async (id: string): Promise<User> => {
      const response = await apiClient.patch<User>(`/admin/users/${id}/activate`);
      return response.data;
    },
    deactivateUser: async (id: string): Promise<User> => {
      const response = await apiClient.patch<User>(`/admin/users/${id}/deactivate`);
      return response.data;
    },
    deleteUser: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/users/${id}`);
    },
  },
};