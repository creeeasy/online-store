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

  // Overlay (slightly darker so modal stands out)
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    transition: 'opacity 0.3s ease',
    padding: theme.spacing.lg,
  };

  // Modal (fullscreen-ish, but still padded & elegant)
  const modalStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    width: '95%',
    height: '90vh',
    maxWidth: '1200px',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeInScale 0.25s ease',
  };

  // Close button
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  // Content (scrollable body)
  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    color: theme.colors.text,
    overflowY: 'auto',
    flex: 1,
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          style={closeButtonStyle}
          onClick={handleClose}
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

        {/* Scrollable Content */}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
