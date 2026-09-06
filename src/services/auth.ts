import api from './api';
import { User } from '@app-types/index';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: 'student' | 'parent';
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (data.role !== 'student' && data.role !== 'parent') {
      throw new Error('Only parent and student accounts can self-register.');
    }

    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }
}

export default new AuthService();
