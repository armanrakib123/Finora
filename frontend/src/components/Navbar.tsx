'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  WalletCards,
  PlusCircle,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  User,
  Menu,
  X,
  Settings,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { BANK_NAME } from '../constants';

export default function Navbar() {
  const {
    isLoggedIn,
    isAdmin,
    theme,
    showThemeToggle,
    toggleTheme,
    logout,
    user,
  } = useAuth();

  const pathname = usePathname();

  const isLanding = pathname === '/';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  /*
   * Supports different possible user structures.
   * Example:
   * user.image
   * user.avatar
   * user.photoURL
   */
  const userImage =
    user?.image ||
    user?.avatar ||
    user?.photoURL ||
    '';

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    'User';

  const userEmail =
    user?.email ||
    '';

  const initials = userName
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  /*
   * Close profile dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /*
   * Close mobile menu when route changes.
   */
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="finora-navbar navbar navbar-expand-lg sticky-top">
      <div
        className={`container ${
          isLanding ? 'container-fluid px-lg-5' : ''
        }`}
      >
        {/* ==================== BRAND ==================== */}

        <Link
          href={isLoggedIn ? '/dashboard' : '/'}
          className="finora-brand navbar-brand"
          onClick={closeMenus}
        >
          <div className='w-10 d-flex justify-content-center align-items-center'>
            <img src="https://i.postimg.cc/KjWzrD28/apple-touch-icon.png" width={45} alt="logo" />
          </div>

          <span className="finora-brand-content">
            <span className="finora-brand-name">
              {BANK_NAME}
            </span>

            <span className="finora-brand-tagline">
              Digital Banking
            </span>
          </span>
        </Link>

        {/* ==================== MOBILE BUTTON ==================== */}

        <button
          type="button"
          className="finora-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

        {/* ==================== NAVIGATION ==================== */}

        <div
          className={`finora-navbar-collapse navbar-collapse ${
            mobileMenuOpen ? 'show' : ''
          }`}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

            {/* ---------- Landing Page ---------- */}

            {!isLoggedIn && isLanding && (
              <>
                <li className="nav-item">
                  <a
                    href="#features"
                    className="finora-nav-link"
                    onClick={closeMenus}
                  >
                    Features
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#security"
                    className="finora-nav-link"
                    onClick={closeMenus}
                  >
                    Security
                  </a>
                </li>
              </>
            )}

            {/* ---------- Logged In Navigation ---------- */}

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    href="/dashboard"
                    className={`finora-nav-link ${
                      isActive('/dashboard')
                        ? 'active'
                        : ''
                    }`}
                    onClick={closeMenus}
                  >
                    <LayoutDashboard size={17} />
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/accounts"
                    className={`finora-nav-link ${
                      isActive('/accounts')
                        ? 'active'
                        : ''
                    }`}
                    onClick={closeMenus}
                  >
                    <WalletCards size={17} />
                    <span>Accounts</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/create-account"
                    className={`finora-nav-link ${
                      isActive('/create-account')
                        ? 'active'
                        : ''
                    }`}
                    onClick={closeMenus}
                  >
                    <PlusCircle size={17} />
                    <span>Open Account</span>
                  </Link>
                </li>

                {isAdmin && (
                  <li className="nav-item">
                    <Link
                      href="/admin"
                      className={`finora-nav-link admin-link ${
                        isActive('/admin')
                          ? 'active'
                          : ''
                      }`}
                      onClick={closeMenus}
                    >
                      <ShieldCheck size={17} />
                      <span>Admin</span>
                    </Link>
                  </li>
                )}

                {/* ---------- Divider ---------- */}

                <li className="finora-nav-divider" />

                {/* ---------- Theme ---------- */}

                {showThemeToggle && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className="finora-theme-button"
                      onClick={toggleTheme}
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun size={17} />
                          <span>Light</span>
                        </>
                      ) : (
                        <>
                          <Moon size={17} />
                          <span>Dark</span>
                        </>
                      )}
                    </button>
                  </li>
                )}

                {/* ---------- User Profile ---------- */}

                <li className="nav-item">
                  <div
                    className="finora-profile-wrapper"
                    ref={profileRef}
                  >
                    <button
                      type="button"
                      className="finora-profile-button"
                      onClick={() =>
                        setProfileOpen(!profileOpen)
                      }
                      aria-expanded={profileOpen}
                    >
                      <span className="finora-avatar">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={userName}
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </span>

                      <span className="finora-profile-info">
                        <span className="finora-profile-name">
                          {userName}
                        </span>

                        <span className="finora-profile-email">
                          {userEmail || 'Finora Customer'}
                        </span>
                      </span>

                      <ChevronDown
                        size={16}
                        className={`finora-chevron ${
                          profileOpen ? 'rotate' : ''
                        }`}
                      />
                    </button>

                    {/* ---------- Dropdown ---------- */}

                    {profileOpen && (
                      <div className="finora-profile-dropdown">

                        <div className="finora-dropdown-user">
                          <div className="finora-dropdown-avatar">
                            {userImage ? (
                              <img
                                src={userImage}
                                alt={userName}
                              />
                            ) : (
                              initials
                            )}
                          </div>

                          <div>
                            <strong>{userName}</strong>
                            <span>
                              {userEmail ||
                                'Finora Customer'}
                            </span>
                          </div>
                        </div>

                        <div className="finora-dropdown-divider" />

                        <Link
                          href="/profile"
                          className="finora-dropdown-item"
                          onClick={closeMenus}
                        >
                          <User size={17} />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/settings"
                          className="finora-dropdown-item"
                          onClick={closeMenus}
                        >
                          <Settings size={17} />
                          <span>Settings</span>
                        </Link>

                        <div className="finora-dropdown-divider" />

                        <button
                          type="button"
                          className="finora-dropdown-logout"
                          onClick={() => {
                            closeMenus();
                            logout();
                          }}
                        >
                          <LogOut size={17} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              </>
            ) : (
              /* ---------- Logged Out ---------- */

              <>
                <li className="nav-item">
                  <Link
                    href="/login"
                    className={`finora-nav-link ${
                      isActive('/login')
                        ? 'active'
                        : ''
                    }`}
                    onClick={closeMenus}
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/register"
                    className="finora-get-started"
                    onClick={closeMenus}
                  >
                    Get started
                    <span>→</span>
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