'use client';

import React, { useState, useEffect } from 'react';
import RouteGuard from '../../components/RouteGuard';
import { adminService } from '../../services/adminService';
import { User, AccountResponse, TransactionResponse } from '../../types';

function AdminContent() {
  const [tab, setTab] = useState<'users' | 'accounts' | 'transactions'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [allAccounts, setAllAccounts] = useState<AccountResponse[]>([]);
  const [allTransactions, setAllTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, a, t] = await Promise.all([
        adminService.getUsers().catch(() => []),
        adminService.getAllAccounts().catch(() => []),
        adminService.getAllTransactions().catch(() => []),
      ]);
      setUsers(u || []);
      setAllAccounts(a || []);
      setAllTransactions(t || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUser = async (id: number) => {
    try {
      await adminService.toggleUserEnabled(id);
      const updated = await adminService.getUsers();
      setUsers(updated || []);
    } catch {
      // ignore
    }
  };

  const getTxnBadgeClass = (type: string) => {
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
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div>
          <h2 className="page-title">Admin panel</h2>
          <p className="page-subtitle">Monitor users, accounts, and transactions from one place.</p>
        </div>
      </div>

      <div className="card modern-card">
        <div className="card-body">
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${tab === 'users' ? 'active' : ''}`}
                onClick={() => setTab('users')}
              >
                Users
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${tab === 'accounts' ? 'active' : ''}`}
                onClick={() => setTab('accounts')}
              >
                Accounts
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${tab === 'transactions' ? 'active' : ''}`}
                onClick={() => setTab('transactions')}
              >
                Transactions
              </button>
            </li>
          </ul>

          {loading ? (
            <div className="p-4 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {tab === 'users' && (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Enabled</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>
                              {u.firstName} {u.lastName}
                            </td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                              <span className={`badge bg-${u.enabled ? 'success' : 'danger'}`}>
                                {u.enabled ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-warning text-white"
                                onClick={() => handleToggleUser(u.id)}
                              >
                                Toggle
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'accounts' && (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Number</th>
                        <th>Owner</th>
                        <th>Type</th>
                        <th>Balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAccounts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            No accounts found
                          </td>
                        </tr>
                      ) : (
                        allAccounts.map((acc) => (
                          <tr key={acc.id}>
                            <td>{acc.accountNumber}</td>
                            <td>{acc.ownerName}</td>
                            <td>{acc.type}</td>
                            <td>
                              {acc.balance.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </td>
                            <td>
                              <span
                                className={`badge bg-${
                                  acc.status === 'ACTIVE' ? 'success' : 'danger'
                                }`}
                              >
                                {acc.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'transactions' && (
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
                      {allTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        allTransactions.map((txn) => (
                          <tr key={txn.id || txn.referenceNumber}>
                            <td>
                              <small>{txn.referenceNumber}</small>
                            </td>
                            <td>
                              <span className={`badge ${getTxnBadgeClass(txn.type)}`}>
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RouteGuard requireAdmin>
      <AdminContent />
    </RouteGuard>
  );
}
