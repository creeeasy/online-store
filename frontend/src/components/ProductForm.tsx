// components/ProductForm.tsx - Enhanced UI
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
import ColorsTab from './ColorsTab';

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
  isEditing = false,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '',
    price: 0,
    discountPrice: undefined,
    description: '',
    images: [''],
    colors: [],
    dynamicFields: [],
    predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map((category) => ({
      category,
      options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
      selectedOptions: [],
      isActive: false,
    })),
    offers: [],
    hiddenFields: [],
    reference: '',
    ...product,
  });

  // Reset form when product changes
  useEffect(() => {
    setFormData({
      name: '',
      price: 0,
      discountPrice: undefined,
      description: '',
      images: [''],
      colors: [],
      dynamicFields: [],
      predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map((category) => ({
        category,
        options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
        selectedOptions: [],
        isActive: false,
      })),
      offers: [],
      hiddenFields: [],
      reference: '',
      ...product,
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch {
      // error handled in parent
    }
  };

  const handleInputChange = (field: keyof IProduct, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const commonProps = {
    formData,
    setFormData,
    validationErrors,
    handleInputChange,
  };

  // --- Theme-based styles using your theme structure ---
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '16px',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'fadeSlideIn 0.25s ease',
    maxWidth: '100%',
  };

  const formStyle: React.CSSProperties = {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxHeight: 'calc(100vh - 220px)',
    overflowY: 'auto',
    backgroundColor: theme.colors.backgroundSecondary,
  };

  const actionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surfaceAlt || theme.colors.backgroundSecondary,
    position: 'sticky',
    bottom: 0,
    padding: '1.5rem 2rem',
    zIndex: 5,
  };

  const submitButtonStyle = (disabled: boolean): React.CSSProperties => ({
    minWidth: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    background: disabled
      ? theme.colors.disabled
      : theme.colors.gradientPrimary || `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.textOnPrimary,
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.25s ease',
    opacity: disabled ? 0.6 : 1,
    boxShadow: disabled ? 'none' : `0 4px 12px ${theme.colors.shadow}`,
  });

  const cancelButtonStyle: React.CSSProperties = {
    minWidth: '140px',
    padding: '1rem 1.5rem',
    backgroundColor: theme.colors.background,
    color: theme.colors.textSecondary,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  };

  const loadingSpinnerStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    border: `2px solid ${theme.colors.white}`,
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
          {activeTab === 'colors' && <ColorsTab {...commonProps} />}

          <div style={actionsContainerStyle}>
            <button
              type="submit"
              disabled={isLoading}
              style={submitButtonStyle(isLoading)}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.shadow}`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.shadow}`;
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
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                e.currentTarget.style.color = theme.colors.text;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
                e.currentTarget.style.color = theme.colors.textSecondary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = theme.colors.border;
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