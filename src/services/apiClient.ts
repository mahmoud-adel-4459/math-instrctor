import axios, { type AxiosInstance } from 'axios';

let rawApiUrl = ((import.meta.env.VITE_API_URL as string) || 'http://localhost:8000').trim();
if (rawApiUrl && !rawApiUrl.startsWith('http://') && !rawApiUrl.startsWith('https://')) {
  rawApiUrl = `https://${rawApiUrl}`;
}
const BASE_URL = rawApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const TOKEN_KEY = 'student-access-token';

export function getAccessToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAccessToken(token: string | null | undefined): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
  has_more_pages?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipCsrf?: boolean;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;
  readonly code?: string;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string[]>,
    code?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

function getXsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.split('; ').find((row) => row.startsWith('XSRF-TOKEN='));
  if (!match) return '';
  return decodeURIComponent(match.split('=')[1]);
}

export async function ensureCsrf(): Promise<void> {
  if (!getXsrfToken() && typeof fetch !== 'undefined') {
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });
  }
}

const AUTH_EXEMPT_PATHS = ['/auth/login', '/auth/register'];

function handleUnauthorized(path: string, code?: string, message?: string): void {
  if (AUTH_EXEMPT_PATHS.some((exempt) => path.includes(exempt))) return;
  if (!getAccessToken()) return;

  setAccessToken(null);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('student-session-expired', {
        detail: {
          code: code || 'SESSION_EXPIRED',
          message: message || 'تم إنهاء جلستك بسبب فتح الحساب من جهاز آخر.',
        },
      })
    );

    // If on a protected route, redirect to login with query param
    if (!window.location.pathname.includes('/login')) {
      const redirectUrl = `/login?reason=${code === 'SESSION_EXPIRED' ? 'session_expired' : 'unauthorized'}`;
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
    }
  }
}

// ── Axios Instance with Security Interceptors ──────────────────────────────
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach Device Fingerprint Headers
  try {
    const stored = localStorage.getItem('app_device_info');
    if (stored) {
      const info = JSON.parse(stored);
      if (info.device_hash) config.headers['X-Device-Hash'] = info.device_hash;
      if (info.device_name) config.headers['X-Device-Name'] = info.device_name;
      if (info.browser) config.headers['X-Browser'] = info.browser;
      if (info.platform) config.headers['X-Platform'] = info.platform;
    }
  } catch {
    // Ignore
  }

  const xsrf = getXsrfToken();
  if (xsrf) {
    config.headers['X-XSRF-TOKEN'] = xsrf;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const data = error.response.data;
      handleUnauthorized(error.config?.url || '', data?.code, data?.message);
    }
    return Promise.reject(error);
  }
);

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const apiPath = path.startsWith('/api/') ? path : `/api/v1${path.startsWith('/') ? path : `/${path}`}`;
  const url = BASE_URL
    ? new URL(`${BASE_URL}${apiPath}`)
    : new URL(apiPath, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.set(key, String(val));
      }
    });
  }

  return url.toString();
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, skipCsrf = false } = opts;

  if (!skipCsrf && !getAccessToken() && method !== 'GET') {
    await ensureCsrf();
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Attach Device Fingerprint
  try {
    const stored = localStorage.getItem('app_device_info');
    if (stored) {
      const info = JSON.parse(stored);
      if (info.device_hash) headers['X-Device-Hash'] = info.device_hash;
      if (info.device_name) headers['X-Device-Name'] = info.device_name;
      if (info.browser) headers['X-Browser'] = info.browser;
      if (info.platform) headers['X-Platform'] = info.platform;
    }
  } catch {
    // Ignore
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const xsrf = getXsrfToken();
  if (xsrf) {
    headers['X-XSRF-TOKEN'] = xsrf;
  }

  const res = await fetch(buildUrl(path, params), {
    method,
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new ApiClientError(res.status, `HTTP ${res.status}`);
  }

  if (!res.ok) {
    const err = json as { message?: string; errors?: Record<string, string[]>; code?: string };
    if (res.status === 401) {
      handleUnauthorized(path, err?.code, err?.message);
    }
    throw new ApiClientError(res.status, err?.message || `HTTP ${res.status}`, err?.errors, err?.code);
  }

  return (json as { data?: T }).data !== undefined ? (json as { data: T }).data : (json as T);
}

async function requestPaginated<T>(path: string, params?: RequestOptions['params']): Promise<PaginatedResult<T>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const stored = localStorage.getItem('app_device_info');
    if (stored) {
      const info = JSON.parse(stored);
      if (info.device_hash) headers['X-Device-Hash'] = info.device_hash;
    }
  } catch {
    // Ignore
  }

  const res = await fetch(buildUrl(path, params), {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  const json = (await res.json()) as {
    message?: string;
    data?: T[];
    meta?: PaginationMeta;
    errors?: Record<string, string[]>;
    code?: string;
  };

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized(path, json?.code, json?.message);
    throw new ApiClientError(res.status, json?.message || `HTTP ${res.status}`, json?.errors, json?.code);
  }

  return {
    data: Array.isArray(json.data) ? json.data : [],
    meta: json.meta ?? {
      current_page: 1,
      per_page: 15,
      total: Array.isArray(json.data) ? json.data.length : 0,
      last_page: 1,
    },
  };
}

function wrap<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export const apiOrigin = BASE_URL;

export const apiClient = {
  get: <T>(path: string, params?: RequestOptions['params']) => request<T>(path, { method: 'GET', params }),
  getPaginated: <T>(path: string, params?: RequestOptions['params']) => requestPaginated<T>(path, params),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  wrap,
  postForm: async <T>(path: string, formData: FormData): Promise<T> => {
    if (!getAccessToken()) {
      await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
    }
    const xsrf = getXsrfToken();
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;

    try {
      const stored = localStorage.getItem('app_device_info');
      if (stored) {
        const info = JSON.parse(stored);
        if (info.device_hash) headers['X-Device-Hash'] = info.device_hash;
      }
    } catch {
      // Ignore
    }

    const res = await fetch(buildUrl(path), {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
    });

    if (!res.ok) {
      let err: { message?: string; errors?: Record<string, string[]>; code?: string } = {};
      try {
        err = await res.json();
      } catch {
        /* ignore */
      }
      if (res.status === 401) handleUnauthorized(path, err?.code, err?.message);
      const firstFieldError = err.errors ? Object.values(err.errors).flat()[0] : undefined;
      throw new ApiClientError(res.status, firstFieldError || err?.message || `HTTP ${res.status}`, err?.errors, err?.code);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    const json = await res.json();
    return (json as { data?: T }).data !== undefined ? (json as { data: T }).data : (json as T);
  },
};
