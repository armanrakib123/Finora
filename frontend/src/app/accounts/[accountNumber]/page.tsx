'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import RouteGuard from '../../../components/RouteGuard';
import { accountService } from '../../../services/accountService';
import { transactionService } from '../../../services/transactionService';
import { AccountResponse, TransactionResponse } from '../../../types';

function AccountDetailContent() {
  const params = useParams();
  const accountNumber = params?.accountNumber as string;

  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!accountNumber) return;

    setLoading(true);
    Promise.all([
      accountService.getAccount(accountNumber),
      transactionService.getHistory(accountNumber),
    ])
      .then(([acc, txns]) => {
        setAccount(acc);
        setTransactions(txns || []);
      })
      .catch(() => {
        setErrorMessage('Failed to load account details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accountNumber]);

  const getBadgeClass = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT':
        return 'bg-success';
      case 'WITHDRAWAL':
      case 'WITHDRAW':
        return 'bg-danger';
      default:
        return 'bg-info';
    }
  };

  const formatDate = (val: string) => {
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? val : d.toLocaleString();
  };

  return (
    <div className="dashboard-grid">
      {loading && (
        <div className="state-card loading-skeleton">
          <div className="placeholder-line"></div>
          <div className="placeholder-line short"></div>
        </div>
      )}

      {!loading && errorMessage && (
        <div className="state-card state-card-warning">{errorMessage}</div>
      )}

      {!loading && account && (
        <>
          <div className="card modern-card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h3 className="mb-2">{account.accountNumber}</h3>
                  <p className="page-subtitle mb-0">
                    {account.type} account • {account.status}
                  </p>
                </div>
                <div className="summary-card p-3">
                  <h6>Current balance</h6>
                  <div className="value">
                    {account.balance.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </div>
                </div>
              </div>
              <p className="text-muted mt-3 mb-4">
                Owner: {account.ownerName} • Created:{' '}
                {new Date(account.createdAt).toLocaleDateString()}
              </p>
              <div className="btn-group flex-wrap gap-2">
                <Link href="/deposit" className="btn btn-success">
                  Deposit
                </Link>
                <Link href="/withdraw" className="btn btn-warning text-white">
                  Withdraw
                </Link>
                <Link href="/transfer" className="btn btn-info text-white">
                  Transfer
                </Link>
              </div>
            </div>
          </div>

          <div className="card modern-card">
            <div className="card-header py-3">
              <h5 className="mb-0">Transaction history</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          No transactions yet
                        </td>
                      </tr>
                    ) : (
                      transactions.map((txn) => (
                        <tr key={txn.id || txn.referenceNumber}>
                          <td>
                            <small>{txn.referenceNumber}</small>
                          </td>
                          <td>
                            <span className={`badge ${getBadgeClass(txn.type)}`}>
                              {txn.type}
                            </span>
                          </td>
                          <td>
                            {txn.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            })}
                          </td>
                          <td>{txn.description}</td>
                          <td>{formatDate(txn.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AccountDetailPage() {
  return (
    <RouteGuard>
      <AccountDetailContent />
    </RouteGuard>
  );
}
