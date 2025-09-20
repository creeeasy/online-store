import React from 'react';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { closeModal } from '../store/slices/modalSlice';

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.modal);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal());
  };

  // Theme-based styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    overflowY: 'auto'
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light transparent background
    backdropFilter: 'blur(8px)', // Blur effect
    WebkitBackdropFilter: 'blur(8px)', // Safari support
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg
  };

  const modalStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    maxWidth: '32rem', // max-w-2xl equivalent
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    zIndex: 10,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <div style={overlayStyle}>
      <div 
        style={backdropStyle}
        onClick={handleClose}
      />
      
      <div style={containerStyle}>
        <div 
          style={modalStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
              e.currentTarget.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.textSecondary;
            }}
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
          
          <div style={contentStyle}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;