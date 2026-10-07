'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { User, LoginRequest, RegisterRequest, JwtResponse } from '../types';

interface AuthContextType {
  user: User | null;
  role: string | null;
  email: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  theme: 'light' | 'dark';
  showThemeToggle: boolean;
  toggleTheme: () => void;
  login: (req: LoginRequest) => Promise<JwtResponse>;
  register: (req: RegisterRequest) => Promise<JwtResponse>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute =
    pathname === '/' || pathname === '/login' || pathname === '/register';
  const showThemeToggle = !isPublicRoute && isLoggedIn;

  // Apply theme to document
  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('Finora-theme', newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, applyTheme]);

  // Handle route change and theme
  useEffect(() => {
    if (isPublicRoute) {
      applyTheme('light');
    } else {
      const stored = (localStorage.getItem('Finora-theme') as 'light' | 'dark') || 'light';
      applyTheme(stored);
    }
  }, [pathname, isPublicRoute, applyTheme]);

  const refreshProfile = useCallback(async () => {
    try {
      if (authService.isLoggedIn()) {
        const profile = await authService.getProfile();
        setUser(profile);
        if (profile.role) setRole(profile.role);
        if (profile.email) setEmail(profile.email);
      }
    } catch {
      // Profile failed or token expired
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const hasToken = authService.isLoggedIn();
    setIsLoggedIn(hasToken);
    setRole(authService.getRole());
    setEmail(authService.getEmail());

    if (hasToken) {
      refreshProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshProfile]);

  const login = async (req: LoginRequest): Promise<JwtResponse> => {
    const res = await authService.login(req);
    setIsLoggedIn(true);
    setRole(res.role);
    setEmail(res.email);
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      // ignore
    }
    return res;
  };

  const register = async (req: RegisterRequest): Promise<JwtResponse> => {
    const res = await authService.register(req);
    setIsLoggedIn(true);
    setRole(res.role);
    setEmail(res.email);
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      // ignore
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    setEmail(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        email,
        isLoggedIn,
        isAdmin: role === 'ADMIN',
        loading,
        theme,
        showThemeToggle,
        toggleTheme,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
