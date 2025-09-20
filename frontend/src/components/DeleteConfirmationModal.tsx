import React, { useState } from 'react';
import { FiCheck, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import Modal from './Modal';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { closeModal } from '../store/slices/modalSlice';
import type { IProduct } from '../types/product';

interface DeleteModalProps {
  onConfirm: (id: string) => Promise<void>;
  isLoading?: boolean; 
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ 
  onConfirm,
  isLoading = false
}) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isOpen, modalType, product: data } = useAppSelector((state) => state.modal);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || modalType !== 'deleteProduct') return null;

  const product: IProduct | null = data || null;

  if (!product) return null;

  const handleClose = () => {
    dispatch(closeModal());
    setIsSuccess(false);
    setIsDeleting(false);
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(product._id);
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  // Unified loading state (internal + external)
  const deletingState = isDeleting || isLoading;

  // Theme-based styles
  const successContainerStyle: React.CSSProperties = {
    padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
    textAlign: 'center'
  };

  const successIconContainerStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${theme.spacing.lg}`
  };

  const successTitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  };

  const successMessageStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem'
  };

  const contentContainerStyle: React.CSSProperties = {
    padding: theme.spacing.xl
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl
  };

  const warningIconContainerStyle: React.CSSProperties = {
    backgroundColor: `${theme.colors.primary}20`,
    padding: theme.spacing.md,
    borderRadius: '50%',
    marginRight: theme.spacing.lg,
    flexShrink: 0
  };

  const headerTextStyle: React.CSSProperties = {
    flex: 1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    margin: 0,
    marginBottom: theme.spacing.xs
  };

  const subtitleStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    margin: 0
  };

  const productCardStyle: React.CSSProperties = {
    backgroundColor: `${theme.colors.primary}10`,
    border: `1px solid ${theme.colors.primary}30`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl
  };

  const productInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg
  };

  const productImageStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: theme.borderRadius.md,
    flexShrink: 0
  };

  const productDetailsStyle: React.CSSProperties = {
    flex: 1
  };

  const productNameStyle: React.CSSProperties = {
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    margin: 0,
    marginBottom: theme.spacing.xs,
    fontSize: '1rem'
  };

  const productDescriptionStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    margin: 0,
    marginBottom: theme.spacing.xs,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const productPriceStyle: React.CSSProperties = {
    color: theme.colors.primary,
    fontWeight: theme.fonts.bold,
    margin: 0,
    fontSize: '1rem'
  };

  const impactAssessmentStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl
  };

  const impactTitleStyle: React.CSSProperties = {
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    margin: 0,
    marginBottom: theme.spacing.sm,
    fontSize: '0.875rem'
  };

  const impactListStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    margin: 0,
    paddingLeft: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const deleteButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: disabled ? theme.colors.textMuted : theme.colors.primary,
    color: theme.colors.secondary,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    opacity: disabled ? 0.6 : 1
  });

  const spinnerStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    border: `2px solid ${theme.colors.secondary}`,
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Modal>
        {isSuccess ? (
          <div style={successContainerStyle}>
            <div style={successIconContainerStyle}>
              <FiCheck style={{ color: theme.colors.primary }} size={32} />
            </div>
            <h3 style={successTitleStyle}>Product Deleted!</h3>
            <p style={successMessageStyle}>The product has been successfully removed.</p>
          </div>
        ) : (
          <div style={contentContainerStyle}>
            <div style={headerStyle}>
              <div style={warningIconContainerStyle}>
                <FiAlertTriangle style={{ color: theme.colors.primary }} size={24} />
              </div>
              <div style={headerTextStyle}>
                <h2 style={titleStyle}>Delete Product</h2>
                <p style={subtitleStyle}>This action cannot be undone.</p>
              </div>
            </div>

            <div style={productCardStyle}>
              <div style={productInfoStyle}>
                <img
                  src={product.images[0] || 'https://picsum.photos/80/80?random=default'}
                  alt={product.name}
                  style={productImageStyle}
                />
                <div style={productDetailsStyle}>
                  <h3 style={productNameStyle}>{product.name}</h3>
                  <p style={productDescriptionStyle}>{product.description}</p>
                  <p style={productPriceStyle}>${product.price}</p>
                </div>
              </div>
            </div>

            <div style={impactAssessmentStyle}>
              <h4 style={impactTitleStyle}>Impact Assessment</h4>
              <ul style={impactListStyle}>
                <li>• This product has {product.dynamicFields?.length ?? 0} custom fields</li>
                <li>• {(product.predefinedFields?.filter(f => f.isActive).length ?? 0)} predefined fields will be removed</li>
                <li>• {product.offers?.length ?? 0} associated offers will be deleted</li>
              </ul>
            </div>

            <div style={actionsStyle}>
              <button
                onClick={handleClose}
                disabled={deletingState}
                style={cancelButtonStyle}
                onMouseEnter={(e) => {
                  if (!deletingState) {
                    e.currentTarget.style.backgroundColor = theme.colors.border;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deletingState) {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={deletingState}
                style={deleteButtonStyle(deletingState)}
                onMouseEnter={(e) => {
                  if (!deletingState) {
                    e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deletingState) {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                  }
                }}
              >
                {deletingState ? (
                  <>
                    <div style={spinnerStyle} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;