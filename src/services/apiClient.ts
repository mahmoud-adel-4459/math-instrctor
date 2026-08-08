// API Client abstraction - Ready for Future Backend Integration

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

class ApiClient {
  public baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  // Simulated async delay to mimic real network responses during mock development
  public async mockDelay<T>(data: T, delayMs: number = 250): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data,
        });
      }, delayMs);
    });
  }
}

export const apiClient = new ApiClient();
