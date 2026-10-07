import { apiRequest } from './api';
import {
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
  TransactionResponse,
} from '../types';

export const transactionService = {
  async deposit(request: DepositRequest): Promise<TransactionResponse> {
    return apiRequest<TransactionResponse>('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async withdraw(request: WithdrawRequest): Promise<TransactionResponse> {
    return apiRequest<TransactionResponse>('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async transfer(request: TransferRequest): Promise<TransactionResponse> {
    return apiRequest<TransactionResponse>('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getHistory(accountNumber: string): Promise<TransactionResponse[]> {
    return apiRequest<TransactionResponse[]>(
      `/transactions/${encodeURIComponent(accountNumber)}`,
      { method: 'GET' }
    );
  },
};
