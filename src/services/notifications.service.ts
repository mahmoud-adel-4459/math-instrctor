import { apiClient, type ApiResponse } from './apiClient';
import { mapNotification } from './mappers';
import type { Notification } from '../types';

export class NotificationsService {
  static async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const result = await apiClient.getPaginated<any>('/student/notifications');
    return apiClient.wrap(result.data.map(mapNotification));
  }

  static async markAsRead(id: string): Promise<ApiResponse<null>> {
    await apiClient.post(`/student/notifications/${id}/read`);
    return apiClient.wrap(null);
  }

  static async markAllAsRead(): Promise<ApiResponse<null>> {
    await apiClient.post('/student/notifications/read-all');
    return apiClient.wrap(null);
  }
}
