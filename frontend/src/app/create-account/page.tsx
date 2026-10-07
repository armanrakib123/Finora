'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RouteGuard from '../../components/RouteGuard';
import { accountService } from '../../services/accountService';

function CreateAccountContent() {
  const [type, setType] = useState<'SAVINGS' | 'CURRENT'>('SAVINGS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await accountService.createAccount({ type });
      setSuccess(`Account ${res.accountNumber} created!`);
      setTimeout(() => {
        router.push('/accounts');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-5 col-md-7">
        <div className="card modern-card p-4 p-lg-5">
          <div className="mb-4">
            <h3 className="mb-2">Open a new account</h3>
            <p className="page-subtitle mb-0">
              Choose the account that best fits your financial goals.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Account Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value as 'SAVINGS' | 'CURRENT')}
                required
              >
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <Link href="/accounts" className="btn btn-link mt-3 px-0">
            Back to accounts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CreateAccountPage() {
  return (
    <RouteGuard>
      <CreateAccountContent />
    </RouteGuard>
  );
}
