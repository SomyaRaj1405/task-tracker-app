'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckIcon, InfoIcon, XIcon } from './Icons';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '360px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard = ({ message, type, onClose }) => {
  const getColors = () => {
    switch (type) {
      case 'error':
        return {
          bg: '#fdf2f2',
          border: 'rgba(239, 68, 68, 0.2)',
          text: '#9b1c1c',
          iconColor: '#de3a3a',
        };
      case 'warning':
        return {
          bg: '#fffbeb',
          border: 'rgba(245, 158, 11, 0.2)',
          text: '#92400e',
          iconColor: '#b78103',
        };
      case 'info':
        return {
          bg: '#eff6ff',
          border: 'rgba(59, 130, 246, 0.2)',
          text: '#1e40af',
          iconColor: '#2563eb',
        };
      default: // success
        return {
          bg: '#f0fdf4',
          border: 'rgba(34, 197, 94, 0.2)',
          text: '#166534',
          iconColor: '#10b981',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '10px',
        padding: '12px 14px',
        color: colors.text,
        fontSize: '0.85rem',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        pointerEvents: 'auto',
        animation: 'toast-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {type === 'success' && <CheckIcon size={16} color={colors.iconColor} />}
        {type === 'info' && <InfoIcon size={16} color={colors.iconColor} />}
        {type === 'warning' && <InfoIcon size={16} color={colors.iconColor} />}
        {type === 'error' && <InfoIcon size={16} color={colors.iconColor} />}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: colors.text,
          cursor: 'pointer',
          opacity: 0.6,
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
      >
        <XIcon size={12} />
      </button>
    </div>
  );
};
