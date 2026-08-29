import { apiClient, type ApiResponse } from './apiClient';
import { mapCertificate } from './mappers';
import type { Certificate } from '../types';

export class CertificatesService {
  static async getStudentCertificates(): Promise<ApiResponse<Certificate[]>> {
    try {
      const result = await apiClient.getPaginated<any>('/student/certificates');
      return apiClient.wrap(result.data.map(mapCertificate));
    } catch {
      return apiClient.wrap([]);
    }
  }
}
