'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/UI/Spinner';
import { useToast } from '../../components/UI/Toast';
import { MailIcon, LockIcon, InfoIcon } from '../../components/UI/Icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const { showToast } = useToast();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email || !email.trim()) {
      setValidationError('Email address is required.');
      return;
    }
    if (!password) {
      setValidationError('Password is required.');
      return;
    }

    try {
      await login(email.trim(), password);
      showToast('Logged in successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error');
      console.error('Sign in process failed:', err.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      background: 'radial-gradient(circle at top right, rgba(222, 76, 58, 0.05) 0%, transparent 40%)'
    }}>
      <div 
        className="card-panel animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '28px 24px',
          background: '#ffffff'
        }}
      >
        {/* Branding header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* Logo element */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto',
            boxShadow: '0 2px 8px rgba(222, 76, 58, 0.25)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            VeloTask
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            Welcome back! Please sign in to your workspace.
          </p>
        </div>

        {/* Validation Errors */}
        {validationError && (
          <div style={{
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            border: '1px solid var(--color-danger-border)',
            padding: '8px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <InfoIcon size={12} color="var(--color-danger)" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Global Context Auth Errors */}
        {error && (
          <div style={{
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            border: '1px solid var(--color-danger-border)',
            padding: '8px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <InfoIcon size={12} color="var(--color-danger)" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <MailIcon size={12} color="var(--text-muted)" />
              </div>
              <input 
                id="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                autoFocus
                style={{ width: '100%', paddingLeft: '30px' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <LockIcon size={12} color="var(--text-muted)" />
              </div>
              <input 
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                style={{ width: '100%', paddingLeft: '30px' }}
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '9px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Sign In'}
          </button>
        </form>

        {/* Redirect toggle */}
        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
