'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import RouteGuard from '../../components/RouteGuard';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { AccountResponse, TransactionResponse, User } from '../../types';
import { BANK_NAME } from '../../constants';

function DashboardContent() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [activeAccounts, setActiveAccounts] = useState(0);
  const [primaryAccountLabel, setPrimaryAccountLabel] = useState('—');
  const [recentTransactions, setRecentTransactions] = useState<TransactionResponse[]>([]);
  const [userAccountNumbers, setUserAccountNumbers] = useState<Set<string>>(new Set());

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber || accountNumber.length <= 8) return accountNumber;
    return `${accountNumber.slice(0, 4)}-••••${accountNumber.slice(-4)}`;
  };

  const formatAccountType = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'SAVINGS':
        return 'Savings';
      case 'CURRENT':
        return 'Checking';
      default:
        return type || 'Account';
    }
  };

  const formatTxnType = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAWAL':
      case 'WITHDRAW':
        return 'Withdrawal';
      case 'TRANSFER':
        return 'Transfer';
      default:
        return type || 'Transaction';
    }
  };

  const isPositiveTransaction = (txn: TransactionResponse) => {
    const type = txn.type.toUpperCase();
    if (type === 'DEPOSIT') return true;
    if (type === 'WITHDRAWAL' || type === 'WITHDRAW') return false;
    if (type === 'TRANSFER') {
      const fromMine = txn.fromAccountNumber && userAccountNumbers.has(txn.fromAccountNumber);
      const toMine = txn.toAccountNumber && userAccountNumbers.has(txn.toAccountNumber);
      if (fromMine && !toMine) return false;
      if (toMine && !fromMine) return true;
      if (fromMine && toMine) return false;
    }
    return true;
  };

  const getAmountPrefix = (txn: TransactionResponse) => {
    return isPositiveTransaction(txn) ? '+' : '-';
  };

  const getActivityAccount = (txn: TransactionResponse) => {
    const type = txn.type.toUpperCase();
    if (type === 'DEPOSIT' && txn.toAccountNumber) return txn.toAccountNumber;
    if ((type === 'WITHDRAW' || type === 'WITHDRAWAL') && txn.fromAccountNumber)
      return txn.fromAccountNumber;
    if (type === 'TRANSFER') {
      if (txn.fromAccountNumber && userAccountNumbers.has(txn.fromAccountNumber)) {
        return txn.fromAccountNumber;
      }
      if (txn.toAccountNumber) return txn.toAccountNumber;
    }
    return txn.toAccountNumber || txn.fromAccountNumber || accounts[0]?.accountNumber || '';
  };

  const getActivityIconClass = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT':
        return 'dash-activity-icon--deposit';
      case 'WITHDRAW':
      case 'WITHDRAWAL':
        return 'dash-activity-icon--withdraw';
      case 'TRANSFER':
        return 'dash-activity-icon--transfer';
      default:
        return 'dash-activity-icon--default';
    }
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? 'Recently updated'
      : date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const myAccounts = await accountService.getMyAccounts();
      const sorted = [...(myAccounts || [])].sort(
        (a, b) => (b.balance || 0) - (a.balance || 0)
      );
      setAccounts(sorted);

      const accNums = new Set(sorted.map((acc) => acc.accountNumber));
      setUserAccountNumbers(accNums);

      const total = sorted.reduce((sum, acc) => sum + (acc.balance || 0), 0);
      setTotalBalance(total);

      const active = sorted.filter((acc) => acc.status.toUpperCase() !== 'CLOSED').length;
      setActiveAccounts(active);

      const primary = sorted[0];
      setPrimaryAccountLabel(
        primary
          ? `${formatAccountType(primary.type)} ${maskAccountNumber(primary.accountNumber)}`
          : '—'
      );

      if (sorted.length === 0) {
        setRecentTransactions([]);
        setLoading(false);
        return;
      }

      // Load histories in parallel
      const txnPromises = sorted.map((acc) =>
        transactionService.getHistory(acc.accountNumber).catch(() => [] as TransactionResponse[])
      );
      const groups = await Promise.all(txnPromises);

      const seen = new Set<string>();
      const combined = groups
        .flat()
        .filter((txn) => {
          if (!txn || !txn.referenceNumber) return false;
          if (seen.has(txn.referenceNumber)) return false;
          seen.add(txn.referenceNumber);
          return true;
        })
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      setRecentTransactions(combined);
    } catch {
      setErrorMessage('We could not load your accounts right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const displayName = user?.firstName || 'there';

  return (
    <div className="dashboard-grid">
      <div className="hero-panel">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <div className="eyebrow">Your financial hub</div>
            <h2 className="mb-2">Welcome back, {displayName}.</h2>
            <p className="mb-0 dash-hero-text">
              Everything you need to manage your money is right here, from account balances to
              transfers and account growth.
            </p>
          </div>
          <div className="stat-pill">
            <span>●</span>
            <span>Secure access</span>
          </div>
        </div>
      </div>

      {loading && (
        <>
          <div className="dash-skeleton-metrics">
            {[1, 2, 3].map((i) => (
              <div key={i} className="dash-skeleton-block loading-skeleton">
                <div className="placeholder-line short"></div>
                <div className="placeholder-line"></div>
              </div>
            ))}
          </div>
          <div className="card modern-card">
            <div className="card-body loading-skeleton">
              <div className="placeholder-line short"></div>
              <div className="placeholder-line"></div>
              <div className="placeholder-line"></div>
            </div>
          </div>
        </>
      )}

      {!loading && errorMessage && (
        <div className="state-card state-card-warning dash-error-card">
          <span>{errorMessage}</span>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={loadDashboard}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !errorMessage && (
        <>
          <div className="dash-metrics mb-2">
            <div className="metric-card">
              <div className="metric-label">Total balance</div>
              <div className="metric-value">
                {totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Active accounts</div>
              <div className="metric-value">{activeAccounts}</div>
            </div>
            <div className="metric-card dash-metric-primary">
              <div className="metric-label">Primary account</div>
              <div className="metric-value">{primaryAccountLabel}</div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card modern-card dash-accounts-panel">
                <div className="card-header d-flex justify-content-between align-items-center py-3">
                  <div>
                    <h5 className="mb-0">Your accounts</h5>
                    <p className="page-subtitle small mb-0">
                      A quick view of your active balances
                    </p>
                  </div>
                  <Link href="/create-account" className="btn btn-primary btn-sm">
                    + Open account
                  </Link>
                </div>
                <div className="card-body">
                  {accounts.length === 0 ? (
                    <div className="summary-card">
                      <h6>No accounts yet</h6>
                      <p className="mb-0">
                        Create your first account to start banking with {BANK_NAME}.
                      </p>
                      <Link
                        href="/create-account"
                        className="btn btn-primary btn-sm dash-empty-cta"
                      >
                        Open your first account
                      </Link>
                    </div>
                  ) : (
                    <div className="dash-account-list">
                      {accounts.map((acc) => (
                        <Link
                          key={acc.accountNumber}
                          href={`/accounts/${acc.accountNumber}`}
                          className="dash-account-row"
                        >
                          <div className="dash-account-info">
                            <div className="dash-account-number">
                              {maskAccountNumber(acc.accountNumber)}
                            </div>
                            <div className="dash-account-badges">
                              <span className="badge bg-info-subtle text-info-emphasis">
                                {formatAccountType(acc.type)}
                              </span>
                              <span className="badge bg-success-subtle text-success-emphasis">
                                {acc.status}
                              </span>
                            </div>
                          </div>
                          <div className="dash-account-balance">
                            <strong>
                              {acc.balance.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </strong>
                            <span>View details →</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="dash-actions">
                <Link href="/deposit" className="dash-action-btn">
                  <span
                    className="dash-action-icon dash-action-icon--deposit"
                    aria-hidden="true"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  </span>
                  <span className="dash-action-copy">
                    <strong>Deposit</strong>
                    <span>Add funds quickly and securely</span>
                  </span>
                </Link>
                <Link href="/withdraw" className="dash-action-btn">
                  <span
                    className="dash-action-icon dash-action-icon--withdraw"
                    aria-hidden="true"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </span>
                  <span className="dash-action-copy">
                    <strong>Withdraw</strong>
                    <span>Move money when you need it</span>
                  </span>
                </Link>
                <Link href="/transfer" className="dash-action-btn">
                  <span
                    className="dash-action-icon dash-action-icon--transfer"
                    aria-hidden="true"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                  </span>
                  <span className="dash-action-copy">
                    <strong>Transfer</strong>
                    <span>Send money between accounts</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="card modern-card">
            <div className="card-header py-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="mb-0">Recent activity</h5>
                  <p className="page-subtitle small mb-0">
                    Your latest transactions across all accounts
                  </p>
                </div>
                {recentTransactions.length > 0 && (
                  <Link href="/accounts" className="btn btn-outline-primary btn-sm">
                    View all
                  </Link>
                )}
              </div>
            </div>
            <div className="card-body">
              {recentTransactions.length === 0 ? (
                <div className="summary-card">
                  <h6>No recent activity</h6>
                  <p className="mb-0">
                    Transactions will appear here after your first deposit, withdrawal, or
                    transfer.
                  </p>
                  {accounts.length > 0 && (
                    <Link href="/deposit" className="btn btn-success btn-sm dash-empty-cta">
                      Make a deposit
                    </Link>
                  )}
                </div>
              ) : (
                recentTransactions.map((txn) => (
                  <Link
                    key={txn.referenceNumber}
                    href={`/accounts/${getActivityAccount(txn)}`}
                    className="dash-activity-link"
                  >
                    <span
                      className={`dash-activity-icon ${getActivityIconClass(txn.type)}`}
                      aria-hidden="true"
                    >
                      {txn.type.toUpperCase() === 'DEPOSIT' ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="19" x2="12" y2="5" />
                          <polyline points="5 12 12 5 19 12" />
                        </svg>
                      ) : txn.type.toUpperCase() === 'WITHDRAW' ||
                        txn.type.toUpperCase() === 'WITHDRAWAL' ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <polyline points="19 12 12 19 5 12" />
                        </svg>
                      ) : txn.type.toUpperCase() === 'TRANSFER' ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      )}
                    </span>
                    <span className="dash-activity-main">
                      <span className="dash-activity-title">
                        {txn.description || formatTxnType(txn.type)}
                      </span>
                      <span className="activity-meta d-block">
                        {formatTxnType(txn.type)} • {formatDate(txn.createdAt)}
                      </span>
                    </span>
                    <span
                      className={`dash-activity-amount ${
                        isPositiveTransaction(txn) ? 'positive' : ''
                      }`}
                    >
                      {getAmountPrefix(txn)}
                      {txn.amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RouteGuard>
      <DashboardContent />
    </RouteGuard>
  );
}
