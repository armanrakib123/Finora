'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { BANK_NAME } from '../constants';

export default function Navbar() {
  const { isLoggedIn, isAdmin, theme, showThemeToggle, toggleTheme, logout } = useAuth();
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className={`container ${isLanding ? 'container-fluid px-lg-5' : ''}`}>
        <Link
          href={isLoggedIn ? '/dashboard' : '/'}
          className="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
        >
          <span className="brand-mark">N</span>
          <span>{BANK_NAME}</span>
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center gap-lg-1">
            {showThemeToggle && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-secondary btn-sm theme-toggle"
                  onClick={toggleTheme}
                  type="button"
                >
                  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </li>
            )}

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    href="/dashboard"
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/accounts"
                    className={`nav-link ${isActive('/accounts') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Accounts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/create-account"
                    className={`nav-link ${isActive('/create-account') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Open Account
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link
                      href="/admin"
                      className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-primary btn-sm ms-lg-2"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {isLanding && (
                  <>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#features"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Features
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#security"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Security
                      </a>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <Link
                    href="/login"
                    className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/register"
                    className="btn btn-primary btn-sm ms-lg-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
