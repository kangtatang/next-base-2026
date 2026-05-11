import React from 'react';
import Modal from './Modal';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

type ConfirmationDialogProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
};

export default function ConfirmationDialog({
  isOpen, title = "Konfirmasi Penghapusan", message, onConfirm, onCancel, isProcessing = false
}: ConfirmationDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WarningAmberIcon style={{ fontSize: '3rem' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>{title}</h3>
        <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.5 }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
          <button 
            onClick={onCancel} 
            disabled={isProcessing}
            className="btn" 
            style={{ 
              background: '#f3f4f6', 
              color: '#374151', 
              border: '1px solid #d1d5db',
              fontWeight: 600,
              minWidth: '100px'
            }}
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isProcessing}
            className="btn" 
            style={{ 
              background: '#ef4444', 
              color: 'white',
              fontWeight: 600,
              minWidth: '100px',
              border: '1px solid #dc2626'
            }}
          >
            {isProcessing ? 'Memproses...' : 'Hapus'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
