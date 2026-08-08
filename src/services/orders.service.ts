import { apiClient, type ApiResponse } from './apiClient';
import type { Order } from '../types';
import { mockOrders } from '../mocks/data';

export class OrdersService {
  static async getStudentOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.mockDelay(mockOrders);
  }
}
