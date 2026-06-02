'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './UI/Toast';
import { LogOutIcon, UserIcon } from './UI/Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  // Helper to extract initials for the avatar icon
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px'
      }}>
        {/* Brand Logo & Geometric Vector Icon */}
        <Link href={user ? '/dashboard' : '/login'} style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {/* Geometric Custom SVG Logo (Todoist Red style) */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(222, 76, 58, 0.2)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '-0.02em'
          }}>
            VeloTask
          </span>
        </Link>

        {/* User Actions */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <div 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-sidebar)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* User Avatar with Initials */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #de4c3a 0%, #f59e0b 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                {getInitials(user.name)}
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            {menuOpen && (
              <>
                <div 
                  onClick={() => setMenuOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 99
                  }}
                />
                <div 
                  className="card-panel animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '38px',
                    right: 0,
                    width: '220px',
                    padding: '6px',
                    background: '#ffffff',
                    borderColor: 'var(--border-hover)',
                    zIndex: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '4px'
                  }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'var(--color-danger)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <LogOutIcon size={14} color="var(--color-danger)" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/login" className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
              Log In
            </Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
