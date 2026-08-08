import { apiClient, type ApiResponse } from './apiClient';
import type { User } from '../types';
import { mockCurrentUser } from '../mocks/data';

export interface LoginCredentials {
  emailOrPhone: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  phone: string;
  password?: string;
  gradeLevel?: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const user: User = {
      ...mockCurrentUser,
      email: credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : mockCurrentUser.email,
      phone: !credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : mockCurrentUser.phone,
    };
    const token = 'mock_jwt_token_math_instructor';
    apiClient.setToken(token);
    return apiClient.mockDelay({ user, token });
  }

  static async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const user: User = {
      id: `stu_${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      phone: credentials.phone,
      role: 'student',
      enrolledCourseIds: [],
      joinedAt: new Date().toISOString().split('T')[0],
    };
    const token = 'mock_jwt_token_math_instructor';
    apiClient.setToken(token);
    return apiClient.mockDelay({ user, token });
  }

  static async logout(): Promise<ApiResponse<null>> {
    apiClient.setToken(null);
    return apiClient.mockDelay(null);
  }

  static async getCurrentUser(): Promise<ApiResponse<User | null>> {
    return apiClient.mockDelay(mockCurrentUser);
  }
}
