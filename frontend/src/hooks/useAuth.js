'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Load user from localStorage on mount
  useEffect(() => {
    const localUser = localStorage.getItem('velotask_user');
    const localToken = localStorage.getItem('velotask_token');

    if (localUser && localToken) {
      try {
        setUser(JSON.parse(localUser));
      } catch (err) {
        console.error('Failed to parse cached user session:', err);
        // Clear corrupt data
        localStorage.removeItem('velotask_user');
        localStorage.removeItem('velotask_token');
      }
    }
    setLoading(false);
  }, []);

  // Protect Pages - redirect to /login if unauthenticated, and /dashboard if authenticated on /login or /signup
  useEffect(() => {
    if (loading) return;

    const publicPages = ['/login', '/signup'];
    const isPublicPage = publicPages.includes(pathname);

    if (!user && !isPublicPage) {
      router.push('/login');
    } else if (user && (isPublicPage || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  /**
   * Log in user
   */
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      const { user: userData, token } = res.data;

      localStorage.setItem('velotask_token', token);
      localStorage.setItem('velotask_user', JSON.stringify(userData));
      
      setUser(userData);
      router.push('/dashboard');
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user
   */
  const signup = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.signup(name, email, password);
      const { user: userData, token } = res.data;

      localStorage.setItem('velotask_token', token);
      localStorage.setItem('velotask_user', JSON.stringify(userData));

      setUser(userData);
      router.push('/dashboard');
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to register account. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out user
   */
  const logout = () => {
    localStorage.removeItem('velotask_token');
    localStorage.removeItem('velotask_user');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError: () => setError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
