import React, { useState } from 'react';
import { FiCopy, FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';

interface CloneProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct | null;
  onConfirm: (reference?: string) => void;
  isLoading?: boolean;
}

const CloneProductModal: React.FC<CloneProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading = false
}) => {
  const { theme } = useTheme();
  const [reference, setReference] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reference || undefined);
  };

  const handleClose = () => {
    setReference('');
    onClose();
  };

  // Theme-based styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: theme.spacing.lg
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: '28rem', // max-w-md equivalent
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    animation: 'slideIn 0.2s ease-out'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.xl,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    margin: 0
  };

  const closeButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const formStyle: React.CSSProperties = {
    padding: theme.spacing.xl
  };

  const contentStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl
  };

  const descriptionStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    fontSize: '0.875rem',
    lineHeight: '1.5'
  };

  const productDetailsStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`
  };

  const detailsTitleStyle: React.CSSProperties = {
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontSize: '0.875rem'
  };

  const detailsListStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    justifyContent: 'flex-end'
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: theme.borderRadius.md
  };

  const submitButtonStyle = (disabled: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: disabled ? theme.colors.textMuted : theme.colors.primary,
    color: theme.colors.secondary,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    boxShadow: disabled ? 'none' : theme.shadows.sm
  });

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>
              <FiCopy style={{ color: theme.colors.primary }} />
              Clone Product
            </h2>
            <button
              onClick={handleClose}
              style={closeButtonStyle}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  e.currentTarget.style.color = theme.colors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }
              }}
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={contentStyle}>
              <p style={descriptionStyle}>
                Create a copy of <strong>"{product.name}"</strong>. The new product will have "(Copy)" appended to its name.
              </p>
              
              <div style={productDetailsStyle}>
                <h4 style={detailsTitleStyle}>Original Product Details:</h4>
                <div style={detailsListStyle}>
                  <p>Price: ${product.price}</p>
                  {product.discountPrice && <p>Discount: ${product.discountPrice}</p>}
                  {product.offers && product.offers.length > 0 && (
                    <p>Offers: {product.offers.length}</p>
                  )}
                </div>
              </div>

              <label style={labelStyle}>
                Reference Source (Optional)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., facebook, tiktok, instagram"
                style={inputStyle}
                disabled={isLoading}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p style={helperTextStyle}>
                Track where this cloned product came from
              </p>
            </div>

            <div style={actionsStyle}>
              <button
                type="button"
                onClick={handleClose}
                style={cancelButtonStyle}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    e.currentTarget.style.color = theme.colors.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={submitButtonStyle(isLoading)}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                  }
                }}
              >
                <FiCopy size={16} />
                {isLoading ? 'Cloning...' : 'Clone Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CloneProductModal;