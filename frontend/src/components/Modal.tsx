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

  // Enhanced overlay with better blur and gradient
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: theme.zIndex.modal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(30, 115, 190, 0.15) 100%)',
    backdropFilter: 'blur(8px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
    transition: theme.transitions.normal,
    padding: theme.spacing.lg,
    animation: 'fadeIn 0.3s ease-out',
  };

  // Enhanced modal with gradient background and improved shadows
  const modalStyle: React.CSSProperties = {
    position: 'relative',
    background: `linear-gradient(145deg, ${theme.colors.surface} 0%, ${theme.colors.surfaceAlt} 100%)`,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `${theme.shadows.xl}, 0 0 0 1px ${theme.colors.border}20`,
    width: '95%',
    height: '90vh',
    maxWidth: '1200px',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    animation: 'modalEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  // Enhanced close button with better styling
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    border: `2px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.fast,
    boxShadow: theme.shadows.sm,
    zIndex: 10,
    width: '2.75rem',
    height: '2.75rem',
  };

  // Enhanced header area with subtle gradient
  const headerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.surface} 100%)`,
    borderBottom: `1px solid ${theme.colors.border}`,
    padding: `${theme.spacing.xl} ${theme.spacing.xl} 0`,
    position: 'relative',
    flexShrink: 0,
  };

  // Content with better scrolling and padding
  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    color: theme.colors.text,
    overflowY: 'auto',
    flex: 1,
    fontSize: theme.fonts.size.md,
    lineHeight: theme.fonts.lineHeight.relaxed,
    fontFamily: theme.fonts.family.body,
  };

  // Custom scrollbar styling
  const scrollbarStyle = React.useMemo(() => {
    const style = document.createElement('style');
    style.textContent = `
      .modal-content::-webkit-scrollbar {
        width: 8px;
      }
      .modal-content::-webkit-scrollbar-track {
        background: ${theme.colors.gray100};
        border-radius: ${theme.borderRadius.full};
      }
      .modal-content::-webkit-scrollbar-thumb {
        background: ${theme.colors.gray300};
        border-radius: ${theme.borderRadius.full};
        transition: ${theme.transitions.fast};
      }
      .modal-content::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.gray400};
      }
    `;
    return style;
  }, [theme]);

  // Inject keyframes and scrollbar styles
  React.useEffect(() => {
    const keyframeStyle = document.createElement('style');
    keyframeStyle.textContent = `
      @keyframes fadeIn {
        from { 
          opacity: 0; 
        }
        to { 
          opacity: 1; 
        }
      }
      
      @keyframes modalEnter {
        from { 
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
        to { 
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    
    document.head.appendChild(keyframeStyle);
    document.head.appendChild(scrollbarStyle);
    
    return () => {
      if (document.head.contains(keyframeStyle)) {
        document.head.removeChild(keyframeStyle);
      }
      if (document.head.contains(scrollbarStyle)) {
        document.head.removeChild(scrollbarStyle);
      }
    };
  }, [scrollbarStyle]);

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header area with close button */}
        <div style={headerStyle}>
          <button
            style={closeButtonStyle}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.error;
              e.currentTarget.style.borderColor = theme.colors.error;
              e.currentTarget.style.color = theme.colors.white;
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `${theme.shadows.md}, 0 0 0 4px ${theme.colors.error}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.surface;
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.color = theme.colors.textSecondary;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
            aria-label="Close modal"
            title="Close modal"
          >
            <FiX size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          style={contentStyle}
          className="modal-content"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;