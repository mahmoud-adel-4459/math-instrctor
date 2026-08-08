import { apiClient, type ApiResponse } from './apiClient';
import type { Certificate } from '../types';
import { mockCertificates } from '../mocks/data';

export class CertificatesService {
  static async getStudentCertificates(): Promise<ApiResponse<Certificate[]>> {
    return apiClient.mockDelay(mockCertificates);
  }
}
