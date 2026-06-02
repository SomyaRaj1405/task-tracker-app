'use client';

import React from 'react';
import { CheckIcon, ClockIcon, CalendarIcon } from './UI/Icons';

export default function DashboardStats({ stats, loading }) {
  const { total = 0, completed = 0, pending = 0 } = stats || {};

  // Calculate percentage of completion
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '10px' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {/* Total Tasks Card */}
        <div className="card-panel" style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}>
              Total Tasks
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{total}</p>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: 'rgba(222, 76, 58, 0.06)',
            border: '1px solid rgba(222, 76, 58, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <CalendarIcon size={18} color="var(--color-primary)" />
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="card-panel" style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}>
              Completed
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{completed}</p>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-success)'
          }}>
            <CheckIcon size={18} color="var(--color-success)" />
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="card-panel" style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}>
              Pending
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-pending)' }}>{pending}</p>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: 'var(--color-pending-bg)',
            border: '1px solid var(--color-pending-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-pending)'
          }}>
            <ClockIcon size={18} color="var(--color-pending)" />
          </div>
        </div>
      </div>

      {/* Dynamic Progress Panel */}
      <div className="card-panel" style={{ padding: '12px 16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Task Progress
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-success)' }}>
            {completionPercentage}% Done
          </span>
        </div>
        
        {/* Progress Track */}
        <div style={{
          width: '100%',
          height: '5px',
          background: '#f1efed',
          borderRadius: '3px',
          overflow: 'hidden',
          display: 'flex'
        }}>
          <div style={{
            width: `${completionPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10b981 0%, #de4c3a 100%)',
            borderRadius: '3px',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>
    </div>
  );
}
