
import React, { useState, useEffect, useCallback } from 'react';
import { FiSave, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import { PREDEFINED_CATEGORIES } from '../data/predefinedFields';
import { validateProductForm, type ValidationResult, type ValidationError, FIELD_TO_TAB_MAPPING } from '../utils/validation';
import BasicInfoTab from './BasicInfoTab';
import ProductFormTabs from './ProductFormTabs';
import OffersTab from './OffersTab';
import QuantityTab from './QuantityTab';
import PredefinedTab from './PredefinedTab';
import DynamicFieldsTab from './DynamicFieldsTab';
import HiddenFieldsTab from './HiddenFieldsTab';
import ColorsTab from './ColorsTab';

interface ProductFormProps {
  product: Partial<IProduct>;
  onSubmit: (productData: Partial<IProduct>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  validationErrors?: Record<string, string[]>; // Backend validation errors
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
  const [frontendValidation, setFrontendValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    errorsByTab: {},
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
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
    allowQuantity: true, // Default to true
    allowMultipleQuantities: false,
    maxQuantityPerInquiry: 1,
    ...product,
  });

  // Validate form data whenever it changes (after first submit attempt)
  const validateFormData = useCallback(() => {
    const validation = validateProductForm(formData);
    setFrontendValidation(validation);
    return validation;
  }, [formData]);

  // Validate on form data change if user has attempted to submit
  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [formData, hasAttemptedSubmit, validateFormData]);

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
      allowQuantity: true,
      allowMultipleQuantities: false,
      maxQuantityPerInquiry: 1,
      ...product,
    });
    // Reset validation state when product changes
    setHasAttemptedSubmit(false);
    setFrontendValidation({
      isValid: true,
      errors: [],
      errorsByTab: {},
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    // Perform frontend validation
    const validation = validateFormData();
    
    // If frontend validation fails, switch to the first tab with errors
    if (!validation.isValid) {
      const firstErrorTab = Object.keys(validation.errorsByTab)[0];
      if (firstErrorTab) {
        setActiveTab(firstErrorTab);
      }
      return;
    }
    
    // If frontend validation passes, try to submit to backend
    try {
      await onSubmit(formData);
      // Reset validation state on successful submission
      setHasAttemptedSubmit(false);
      setFrontendValidation({
        isValid: true,
        errors: [],
        errorsByTab: {},
      });
    } catch {
      // Backend errors are handled in parent component
      // and passed back via validationErrors prop
    }
  };

  const handleInputChange = (field: keyof IProduct, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Combine frontend and backend errors
  const getAllErrors = (): ValidationError[] => {
    const frontendErrors = frontendValidation.errors;
    const backendErrors: ValidationError[] = [];
    
    // Convert backend validation errors to our format
    Object.entries(validationErrors).forEach(([field, messages]) => {
      messages.forEach(message => {
        // Map field to tab based on FIELD_TO_TAB_MAPPING
        const tab = FIELD_TO_TAB_MAPPING[field] || 'basic';
        backendErrors.push({
          field,
          message,
          tab,
        });
      });
    });
    
    return [...frontendErrors, ...backendErrors];
  };

  const getAllErrorsByTab = (): Record<string, ValidationError[]> => {
    const allErrors = getAllErrors();
    return allErrors.reduce((acc, error) => {
      if (!acc[error.tab]) {
        acc[error.tab] = [];
      }
      acc[error.tab].push(error);
      return acc;
    }, {} as Record<string, ValidationError[]>);
  };

  const hasTabErrors = (tabName: string): boolean => {
    const errorsByTab = getAllErrorsByTab();
    return (errorsByTab[tabName] && errorsByTab[tabName].length > 0);
  };

  const commonProps = {
    formData,
    setFormData,
    validationErrors: getAllErrorsByTab(),
    handleInputChange,
    hasAttemptedSubmit,
    allErrors: getAllErrors(),
  };

  // Theme-based styles
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
        <ProductFormTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          hasTabErrors={hasTabErrors}
        />
        <form onSubmit={handleSubmit} style={formStyle}>
          {activeTab === 'basic' && <BasicInfoTab {...commonProps} />}
          {activeTab === 'quantity' && <QuantityTab {...commonProps} />}
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