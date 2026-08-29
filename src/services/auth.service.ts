import { apiClient, ensureCsrf, setAccessToken, type ApiResponse } from './apiClient';
import { getDeviceInfo } from '../lib/deviceFingerprint';
import { mapUser } from './mappers';
import type { User } from '../types';

export interface LoginCredentials {
  emailOrPhone: string;
  password?: string;
  device_hash?: string;
  device_name?: string;
  browser?: string;
  platform?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  gradeLevel?: string;
}

interface AuthUserPayload {
  user?: any;
  id?: number | string;
}

function extractUser(payload: AuthUserPayload | any): User {
  return mapUser(payload?.user ?? payload);
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    setAccessToken(null);
    await ensureCsrf();

    const device = await getDeviceInfo();

    const payload = await apiClient.post<{ user?: unknown; token?: string | null } & Record<string, unknown>>('/auth/login', {
      email: credentials.emailOrPhone,
      password: credentials.password,
      device_hash: credentials.device_hash || device.device_hash,
      device_name: credentials.device_name || device.device_name,
      browser: credentials.browser || device.browser,
      platform: credentials.platform || device.platform,
    });
    if (payload?.token) {
      setAccessToken(payload.token);
    }
    const user = extractUser(payload);
    return apiClient.wrap({ user, token: payload?.token || '' }, 'تم تسجيل الدخول بنجاح.');
  }

  static async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await ensureCsrf();
    await apiClient.post('/auth/register', {
      name: credentials.name,
      email: credentials.email,
      phone: credentials.phone,
      password: credentials.password,
      password_confirmation: credentials.confirmPassword || credentials.password,
    });
    return AuthService.login({
      emailOrPhone: credentials.email,
      password: credentials.password,
    });
  }

  static async logout(): Promise<ApiResponse<null>> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      /* session may already be gone */
    } finally {
      setAccessToken(null);
    }
    return apiClient.wrap(null);
  }

  static async getCurrentUser(): Promise<ApiResponse<User | null>> {
    const raw = await apiClient.get<any>('/auth/me');
    return apiClient.wrap(mapUser(raw));
  }

  static async requestDeviceReset(payload: { email: string; reason: string }): Promise<ApiResponse<unknown>> {
    const device = await getDeviceInfo();
    return apiClient.post('/auth/device-reset-request', {
      email: payload.email,
      reason: payload.reason,
      device_hash: device.device_hash,
      device_name: device.device_name,
    });
  }
}
