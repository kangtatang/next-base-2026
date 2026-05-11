import React from 'react';

export default function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'var(--surface)',
        padding: '2rem',
        borderRadius: 'var(--radius-max)',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        border: '1px solid var(--border)'
      }}>
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute', top: '1rem', right: '1.2rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.5rem', color: 'var(--foreground)', opacity: 0.5
          }}
        >
          &times;
        </button>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}
