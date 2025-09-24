import React from 'react';
import { WilayaSelect } from './WilayaInput';
import type { IDynamicField, IProduct } from '../types/product';

interface OrderInquiryFormProps {
  product: IProduct;
  customerData: Record<string, any>;
  fieldErrors: Record<string, string>;
  selectedVariants: Record<string, string>;
  onCustomerDataChange: (field: string, value: string) => void;
  onVariantChange: (category: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  validationErrors: any[];
  productColors: {
    primary: string;
    primaryDark: string;
  };
  theme: any;
}

const OrderInquiryForm: React.FC<OrderInquiryFormProps> = ({
  product,
  customerData,
  fieldErrors,
  selectedVariants,
  onCustomerDataChange,
  onVariantChange,
  onSubmit,
  isSubmitting,
  validationErrors,
  productColors,
  theme
}) => {
  // Get all required customer data fields from product
  const getCustomerDataFields = (): IDynamicField[] => {
    const fields: IDynamicField[] = [];
    
    if (product?.dynamicFields) {
      product.dynamicFields.forEach(field => {
        if (field.isRequired) {
          fields.push(field);
        }
      });
    }
    
    return fields;
  };

  // Get hidden fields as data attributes for forms
  const getHiddenFieldsDataAttributes = () => {
    const hiddenFields = product?.hiddenFields?.filter(field => field.key && field.value) || [];
    const attributes: Record<string, string> = {};
    
    hiddenFields.forEach(field => {
      if (field.key && field.value) {
        attributes[`data-hidden-${field.key}`] = field.value;
      }
    });
    
    return attributes;
  };

  const customerDataFields = getCustomerDataFields();
  const hasPredefinedFields = product.predefinedFields && 
    product.predefinedFields.some((field) => field.isActive && field.selectedOptions.length > 0);

  if (customerDataFields.length === 0 && !hasPredefinedFields) {
    return null;
  }

  return (
    <div 
      className="rounded-2xl shadow-xl overflow-hidden"
      style={{
        backgroundColor: theme.colors.surface,
        border: `2px solid ${productColors.primary}`,
        boxShadow: theme.shadows.lg
      }}
      {...getHiddenFieldsDataAttributes()}
    >
      <div 
        style={{
          background: `linear-gradient(to right, ${productColors.primary}, ${productColors.primaryDark})`,
          color: theme.colors.textOnPrimary,
          padding: theme.spacing.lg
        }}
      >
        <h2 
          className="text-2xl font-bold flex items-center gap-3"
          style={{ fontFamily: theme.fonts.family.heading }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Order Inquiry
        </h2>
        <p className="mt-2 opacity-90">
          Complete your inquiry details below
        </p>
      </div>
      
      <div style={{ padding: theme.spacing.xl }}>
        {/* Display form errors */}
        {(Object.keys(fieldErrors).length > 0 || validationErrors.length > 0) && (
          <div 
            className="mb-6 p-4 rounded-xl"
            style={{
              backgroundColor: theme.colors.error + '15',
              border: `1px solid ${theme.colors.error}`,
              color: theme.colors.error
            }}
          >
            <h4 className="font-bold mb-2">Please fix the following errors:</h4>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(fieldErrors).map(([field, error], index) => (
                <li key={index}>{error}</li>
              ))}
              {validationErrors.map((error, index) => (
                <li key={`val-${index}`}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Customer Data Fields */}
        <div className="space-y-6">
          {customerDataFields.map((field) => (
            <div key={field.key}>
              {field.key === "wilaya" ? (
                <WilayaSelect
                  fieldName={field.key}
                  value={customerData[field.key] || ''}
                  onChange={(e) => onCustomerDataChange(field.key, e.target.value)}
                  required={field.isRequired}
                  errors={
                    fieldErrors[field.key]
                      ? { [field.key]: [fieldErrors[field.key]] }
                      : {}
                  }
                />
              ) : (
                <>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme.colors.text }}
                  >
                    {field.placeholder} {field.isRequired && '*'}
                  </label>
                  <input
                    type="text"
                    value={customerData[field.key] || ''}
                    onChange={(e) => onCustomerDataChange(field.key, e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                    style={{
                      backgroundColor: theme.colors.surface,
                      borderColor: fieldErrors[field.key] 
                        ? theme.colors.error 
                        : theme.colors.border,
                      color: theme.colors.text
                    }}
                    onFocus={(e) => {
                      if (!fieldErrors[field.key]) {
                        e.currentTarget.style.borderColor = productColors.primary;
                      }
                    }}
                    onBlur={(e) => {
                      if (!fieldErrors[field.key]) {
                        e.currentTarget.style.borderColor = theme.colors.border;
                      }
                    }}
                    placeholder={field.placeholder}
                  />
                </>
              )}

              {fieldErrors[field.key] && (
                <p 
                  className="text-sm mt-1"
                  style={{ color: theme.colors.error }}
                >
                  {fieldErrors[field.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Predefined Variants */}
        {hasPredefinedFields && (
          <div className="space-y-4 mt-6">
            <h3 
              className="text-lg font-bold"
              style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.family.heading
              }}
            >
              Product Options
            </h3>
            {product.predefinedFields!
              .filter((field) => field.isActive && field.selectedOptions.length > 0)
              .map((field) => (
                <div key={field.category}>
                  <label 
                    className="block text-sm font-semibold mb-2 capitalize"
                    style={{ color: theme.colors.text }}
                  >
                    {field.category}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {field.selectedOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => onVariantChange(field.category, option)}
                        className="px-4 py-2 rounded-lg border-2 transition-all capitalize"
                        style={{
                          borderColor: selectedVariants[field.category] === option
                            ? productColors.primary
                            : theme.colors.border,
                          backgroundColor: selectedVariants[field.category] === option
                            ? productColors.primary
                            : theme.colors.surface,
                          color: selectedVariants[field.category] === option
                            ? theme.colors.textOnPrimary
                            : theme.colors.text
                        }}
                        onMouseEnter={(e) => {
                          if (selectedVariants[field.category] !== option) {
                            e.currentTarget.style.borderColor = productColors.primary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedVariants[field.category] !== option) {
                            e.currentTarget.style.borderColor = theme.colors.border;
                          }
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] mt-6"
          style={{
            background: isSubmitting
              ? theme.colors.disabled
              : `linear-gradient(to right, ${productColors.primary}, ${productColors.primaryDark})`,
            color: theme.colors.textOnPrimary,
            boxShadow: theme.shadows.lg
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </div>
    </div>
  );
};

export default OrderInquiryForm;