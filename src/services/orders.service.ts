import { apiClient, type ApiResponse } from './apiClient';
import type { Order } from '../types';

export class OrdersService {
  static async getStudentOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const result = await apiClient.getPaginated<any>('/student/orders');
      return apiClient.wrap(
        result.data.map((raw) => ({
          id: String(raw.id),
          courseId: String(raw.course_id || raw.course?.id || ''),
          courseTitle: raw.course?.title || raw.course_title || 'كورس',
          amount: Number(raw.amount || raw.total || 0),
          paymentMethod: raw.payment_method || '—',
          status: raw.status || 'pending',
          createdAt: raw.created_at || '',
        })),
      );
    } catch {
      return apiClient.wrap([]);
    }
  }
}
