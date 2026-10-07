'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RouteGuard from '../../components/RouteGuard';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { AccountResponse } from '../../types';

function TransferContent() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [fromAccountNumber, setFromAccountNumber] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
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
    if (!fromAccountNumber || !toAccountNumber || !amount) {
      setError('All fields are required');
      return;
    }

    if (!/^ACC-\d{4}-\d{6}$/.test(toAccountNumber.trim())) {
      setError('Invalid account number format (e.g. ACC-2026-XXXXXX)');
      return;
    }

    if (fromAccountNumber === toAccountNumber.trim()) {
      setError('Cannot transfer to the same account');
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      const res = await transactionService.transfer({
        fromAccountNumber,
        toAccountNumber: toAccountNumber.trim(),
        amount: numAmount,
        description: description || undefined,
      });
      setSuccess(
        `Transferred ${numAmount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}. Ref: ${res.referenceNumber}`
      );
      setAmount('');
      setToAccountNumber('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6 col-md-8">
        <div className="card modern-card p-4 p-lg-5">
          <div className="mb-4">
            <h3 className="mb-2">Transfer funds</h3>
            <p className="page-subtitle mb-0">
              Securely move money between accounts in moments.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">From account</label>
              <select
                className="form-select"
                value={fromAccountNumber}
                onChange={(e) => setFromAccountNumber(e.target.value)}
                required
              >
                <option value="">Select source account...</option>
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
              <label className="form-label">To account number</label>
              <input
                type="text"
                className="form-control"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                required
                placeholder="e.g. ACC-2026-XXXXXX"
              />
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
                placeholder="e.g. Invoice payment, Split bill"
              />
            </div>

            <button
              type="submit"
              className="btn btn-info w-100 text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Transfer funds'}
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

export default function TransferPage() {
  return (
    <RouteGuard>
      <TransferContent />
    </RouteGuard>
  );
}
