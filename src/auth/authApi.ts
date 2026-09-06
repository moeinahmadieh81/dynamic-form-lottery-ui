import { http } from '../api/http';
import type { AuthResponse, UserSummary } from '../types/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  displayName: string;
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/login', request);
  return data;
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/register', request);
  return data;
}

export async function getCurrentUser(): Promise<UserSummary> {
  const { data } = await http.get<UserSummary>('/auth/me');
  return data;
}
