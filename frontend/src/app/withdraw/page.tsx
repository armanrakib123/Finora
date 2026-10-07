'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RouteGuard from '../../components/RouteGuard';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { AccountResponse } from '../../types';

function WithdrawContent() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    accountService
      .getMyAccounts()
      .then((data) => setAccounts(data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const numAmount = parseFloat(amount);
    if (!accountNumber) {
      setError('Please select an account');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      const res = await transactionService.withdraw({
        accountNumber,
        amount: numAmount,
        description: description || undefined,
      });
      setSuccess(
        `Withdrew ${numAmount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}. Ref: ${res.referenceNumber}`
      );
      setAmount('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-5 col-md-7">
        <div className="card modern-card p-4 p-lg-5">
          <div className="mb-4">
            <h3 className="mb-2">Withdraw money</h3>
            <p className="page-subtitle mb-0">
              Move funds from your account when you need them.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Account</label>
              <select
                className="form-select"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              >
                <option value="">Select account...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} (
                    {acc.balance.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                    )
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description (optional)</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. ATM withdrawal, Bill payment"
              />
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Withdraw funds'}
            </button>
          </form>

          <Link href="/dashboard" className="btn btn-link mt-3 px-0">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WithdrawPage() {
  return (
    <RouteGuard>
      <WithdrawContent />
    </RouteGuard>
  );
}
