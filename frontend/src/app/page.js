'use client';

import React from 'react';
import Spinner from '../components/UI/Spinner';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px'
    }}>
      <Spinner size="lg" />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} className="animate-pulse">
        Directing you to your dashboard...
      </p>
    </div>
  );
}
