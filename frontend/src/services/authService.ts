import { apiRequest } from './api';
import { LoginRequest, RegisterRequest, JwtResponse, User } from '../types';

export const authService = {
  async register(request: RegisterRequest): Promise<JwtResponse> {
    const res = await apiRequest<JwtResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    this.saveTokens(res);
    return res;
  },

  async login(request: LoginRequest): Promise<JwtResponse> {
    const res = await apiRequest<JwtResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    this.saveTokens(res);
    return res;
  },

  async getProfile(): Promise<User> {
    return apiRequest<User>('/auth/profile', { method: 'GET' });
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_email');
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_role');
  },

  getEmail(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_email');
  },

  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  },

  saveTokens(res: JwtResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', res.accessToken);
      localStorage.setItem('refresh_token', res.refreshToken);
      localStorage.setItem('user_role', res.role);
      localStorage.setItem('user_email', res.email);
    }
  },
};
