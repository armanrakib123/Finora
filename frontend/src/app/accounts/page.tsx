'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RouteGuard from '../../components/RouteGuard';
import { accountService } from '../../services/accountService';
import { AccountResponse } from '../../types';

function AccountsContent() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    accountService
      .getMyAccounts()
      .then((data) => {
        setAccounts(data || []);
      })
      .catch(() => {
        setErrorMessage('We could not load your accounts right now.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-grid">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div>
          <h2 className="page-title">My accounts</h2>
          <p className="page-subtitle">Keep track of each account and its current balance.</p>
        </div>
        <Link href="/create-account" className="btn btn-primary">
          + Open account
        </Link>
      </div>

      {loading && (
        <div className="state-card loading-skeleton">
          <div className="placeholder-line"></div>
          <div className="placeholder-line short"></div>
        </div>
      )}

      {!loading && errorMessage && (
        <div className="state-card state-card-warning">{errorMessage}</div>
      )}

      {!loading && !errorMessage && (
        <>
          {accounts.length === 0 ? (
            <div className="summary-card">
              No accounts found yet. Create your first account to get started.
            </div>
          ) : (
            accounts.map((acc) => (
              <div className="card modern-card mb-3" key={acc.id}>
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <div className="fw-bold">{acc.accountNumber}</div>
                    <div className="mt-1">
                      <span className="badge bg-info-subtle text-info-emphasis">{acc.type}</span>
                      <span className="badge bg-success-subtle text-success-emphasis ms-1">
                        {acc.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold fs-5">
                      {acc.balance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </div>
                    <Link
                      href={`/accounts/${acc.accountNumber}`}
                      className="btn btn-outline-primary btn-sm mt-2"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default function AccountsPage() {
  return (
    <RouteGuard>
      <AccountsContent />
    </RouteGuard>
  );
}
