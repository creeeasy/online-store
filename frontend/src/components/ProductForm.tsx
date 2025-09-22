// components/ProductForm.tsx - Updated version
import React, { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import { PREDEFINED_CATEGORIES } from '../data/predefinedFields';
import BasicInfoTab from './BasicInfoTab';
import ProductFormTabs from './ProductFormTabs';
import OffersTab from './OffersTab';
import PredefinedTab from './PredefinedTab';
import DynamicFieldsTab from './DynamicFieldsTab';
import HiddenFieldsTab from './HiddenFieldsTab';
import ColorsTab from './ColorsTab'; // Add this import

interface ProductFormProps {
  product: Partial<IProduct>;
  onSubmit: (productData: Partial<IProduct>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  validationErrors?: Record<string, string[]>;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading,
  validationErrors = {},
  isEditing = false
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '',
    price: 0,
    discountPrice: undefined,
    description: '',
    images: [''],
    colors: [], // Add colors field
    dynamicFields: [],
    predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
      category,
      options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
      selectedOptions: [],
      isActive: false
    })),
    offers: [],
    hiddenFields: [],
    reference: '',
    ...product
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Reset form when product changes
  useEffect(() => {
    setFormData({
      name: '',
      price: 0,
      discountPrice: undefined,
      description: '',
      images: [''],
      colors: [], // Add colors field
      dynamicFields: [],
      predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
        category,
        options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
        selectedOptions: [],
        isActive: false
      })),
      offers: [],
      hiddenFields: [],
      reference: '',
      ...product
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    try {
      await onSubmit(formData);
    } catch {
      // error handled in parent
    }
  };

  const handleInputChange = (field: keyof IProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const commonProps = {
    formData,
    setFormData,
    validationErrors,
    handleInputChange,
  };

  // --- Theme-based styles ---
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeSlideIn 0.25s ease'
  };

  const formStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
    maxHeight: 'calc(100vh - 220px)',
    overflowY: 'auto'
  };

  const actionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.secondaryLight,
    position: 'sticky',
    bottom: 0,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    zIndex: 5,
  };

  const submitButtonStyle = (disabled: boolean): React.CSSProperties => ({
    minWidth: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    background: disabled
      ? theme.colors.textMuted
      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    border: 'none',
    fontWeight: theme.fonts.semiBold,
    fontSize: '0.95rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.25s ease',
    opacity: disabled ? 0.6 : 1,
    boxShadow: disabled ? 'none' : theme.shadows.md
  });

  const cancelButtonStyle: React.CSSProperties = {
    minWidth: '120px',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.textSecondary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    fontWeight: theme.fonts.medium,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: theme.shadows.sm
  };

  const loadingSpinnerStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    border: `2px solid ${theme.colors.secondary}`,
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  // --- Keyframes ---
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeSlideIn {
      0% { opacity: 0; transform: translateY(12px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        <ProductFormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <form onSubmit={handleSubmit} style={formStyle}>
          {activeTab === 'basic' && <BasicInfoTab {...commonProps} />}
          {activeTab === 'predefined' && <PredefinedTab {...commonProps} />}
          {activeTab === 'offers' && <OffersTab {...commonProps} />}
          {activeTab === 'hidden' && <HiddenFieldsTab {...commonProps} />}
          {activeTab === 'dynamic' && <DynamicFieldsTab {...commonProps} />}
          {activeTab === 'colors' && <ColorsTab {...commonProps} />} {/* Add ColorsTab */}

          <div style={actionsContainerStyle}>
            <button
              type="submit"
              disabled={isLoading}
              style={submitButtonStyle(isLoading)}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={loadingSpinnerStyle} />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  {isEditing ? 'Update' : 'Save'} Product
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={cancelButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondaryDark;
                e.currentTarget.style.color = theme.colors.text;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
                e.currentTarget.style.color = theme.colors.textSecondary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;