import { apiRequest } from './api';
import { CreateAccountRequest, AccountResponse } from '../types';

export const accountService = {
  async createAccount(request: CreateAccountRequest): Promise<AccountResponse> {
    return apiRequest<AccountResponse>('/accounts', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getAccount(accountNumber: string): Promise<AccountResponse> {
    return apiRequest<AccountResponse>(`/accounts/${encodeURIComponent(accountNumber)}`, {
      method: 'GET',
    });
  },

  async getMyAccounts(): Promise<AccountResponse[]> {
    return apiRequest<AccountResponse[]>('/accounts/my', {
      method: 'GET',
    });
  },

  async closeAccount(accountNumber: string): Promise<void> {
    return apiRequest<void>(`/accounts/${encodeURIComponent(accountNumber)}/close`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  },
};
