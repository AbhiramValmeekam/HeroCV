import api from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/google', { credential });
    return data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; user: User }> {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; token: string; message: string }> {
    const { data } = await api.put('/auth/password', { currentPassword, newPassword });
    return data;
  },
};
