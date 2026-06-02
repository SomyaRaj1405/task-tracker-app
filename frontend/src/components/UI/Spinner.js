import React from 'react';

/**
 * Reusable premium spinner for visual loading states
 */
export default function Spinner({ size = 'md', color = 'primary', className = '' }) {
  // Map dimensions
  const sizes = {
    sm: '16px',
    md: '32px',
    lg: '48px'
  };

  const selectedSize = sizes[size] || sizes.md;

  // Map colors
  const colors = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    white: '#ffffff'
  };

  const selectedColor = colors[color] || colors.primary;

  return (
    <div className={`spinner-container ${className}`} style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        className="spinner-element"
        style={{
          width: selectedSize,
          height: selectedSize,
          border: '2px solid rgba(255, 255, 255, 0.08)',
          borderTop: `2px solid ${selectedColor}`,
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }}
      />
    </div>
  );
}
