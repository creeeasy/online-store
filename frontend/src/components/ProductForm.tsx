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
    } catch (error) {
      // Error handling is done in parent component
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

  // Theme-based styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden'
  };

  const formStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto'
  };

  const actionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border}`
  };

  const submitButtonStyle = (disabled: boolean): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: disabled ? theme.colors.textMuted : theme.colors.primary,
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    border: 'none',
    fontWeight: theme.fonts.semiBold,
    fontSize: '0.875rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    boxShadow: disabled ? 'none' : theme.shadows.sm
  });

  const cancelButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    fontWeight: theme.fonts.medium,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const loadingSpinnerStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    border: `2px solid ${theme.colors.secondary}`,
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: theme.spacing.sm
  };

  // Add keyframes for loading spinner
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={containerStyle}>
        <ProductFormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <form onSubmit={handleSubmit} style={formStyle}>
          {activeTab === 'basic' && <BasicInfoTab {...commonProps} />}
          {activeTab === 'predefined' && <PredefinedTab {...commonProps} />}
          {activeTab === 'offers' && <OffersTab {...commonProps} />}
          {activeTab === 'hidden' && <HiddenFieldsTab {...commonProps} />}
          {activeTab === 'dynamic' && <DynamicFieldsTab {...commonProps} />}

          <div style={actionsContainerStyle}>
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
                e.currentTarget.style.backgroundColor = theme.colors.border;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
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