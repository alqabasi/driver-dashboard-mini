export interface User {
  id: string;
  fullName: string;
  mobilePhone: string;
  status?: 'active' | 'inactive';
  isActive: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  mobilePhone: string;
  password: string;
}

export interface CreateUserRequest {
  fullName: string;
  mobilePhone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: Partial<User>; // Depending on API, might return user info
}

export interface ApiError {
  message: string;
  status?: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}