import { apiRequest } from './api';
import { User, AccountResponse, TransactionResponse } from '../types';

export const adminService = {
  async getUsers(): Promise<User[]> {
    return apiRequest<User[]>('/admin/users', { method: 'GET' });
  },

  async toggleUserEnabled(userId: number): Promise<User> {
    return apiRequest<User>(`/admin/users/${userId}/toggle-enabled`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  },

  async getAllAccounts(): Promise<AccountResponse[]> {
    return apiRequest<AccountResponse[]>('/admin/accounts', { method: 'GET' });
  },

  async getAllTransactions(): Promise<TransactionResponse[]> {
    return apiRequest<TransactionResponse[]>('/admin/transactions', { method: 'GET' });
  },
};
