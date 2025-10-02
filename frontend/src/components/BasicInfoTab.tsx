// src/components/ProductForm/BasicInfoTab.tsx - Enhanced with offer title styling inputs
import React, { useRef, useEffect } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import { validateImageFile } from '../utils/fileUpload';
import { toast } from 'react-toastify';
import { useImageUpload } from '../hooks/useUpload';
import { getFieldErrors, hasFieldError, type ValidationError } from '../utils/validation';
import ErrorDisplay from './ErrorDisplay';

interface BasicInfoTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, ValidationError[]>;
  handleInputChange: (field: keyof IProduct, value: any) => void;
  hasAttemptedSubmit: boolean;
  allErrors: ValidationError[];
}

// Font family options
const FONT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Palatino, serif', label: 'Palatino' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
  { value: 'Impact, fantasy', label: 'Impact' },
  { value: 'Lucida Console, monospace', label: 'Lucida Console' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Cairo, sans-serif', label: 'Cairo (Arabic)' },
  { value: 'Tajawal, sans-serif', label: 'Tajawal (Arabic)' },
  { value: 'Almarai, sans-serif', label: 'Almarai (Arabic)' },
  { value: 'Amiri, serif', label: 'Amiri (Arabic)' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: '100 - Thin' },
  { value: '200', label: '200 - Extra Light' },
  { value: '300', label: '300 - Light' },
  { value: '400', label: '400 - Normal' },
  { value: '500', label: '500 - Medium' },
  { value: '600', label: '600 - Semi Bold' },
  { value: '700', label: '700 - Bold' },
  { value: '800', label: '800 - Extra Bold' },
  { value: '900', label: '900 - Black' },
  { value: 'lighter', label: 'Lighter' },
  { value: 'bolder', label: 'Bolder' },
];

// Color Input Component
const ColorInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const { theme } = useTheme();
  
  const colorInputContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  };

  const colorTextInputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.5rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    outline: 'none',
    fontSize: '0.875rem',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    minWidth: '80px',
  };

  const colorPickerStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    padding: 0,
  };

  return (
    <div style={colorInputContainerStyle}>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        style={colorTextInputStyle}
        maxLength={7}
      />
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        style={colorPickerStyle}
      />
    </div>
  );
};

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  formData, 
  validationErrors,
  handleInputChange,
  hasAttemptedSubmit,
  allErrors
}) => {
  const { theme } = useTheme();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();
  
  // Get errors for this tab
  const tabErrors = validationErrors.basic || [];

  // Auto-focus first error field when tab becomes active and has errors
  useEffect(() => {
    if (hasAttemptedSubmit && tabErrors.length > 0) {
      const firstError = tabErrors[0];
      const fieldName = firstError.field.split('.')[0]; // Get main field name
      const element = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`) as HTMLElement;
      if (element) {
        setTimeout(() => element.focus(), 100);
      }
    }
  }, [hasAttemptedSubmit, tabErrors]);

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    handleInputChange('images', newImages);
  };

  const handleImageUpload = (index: number, file: File) => {
    uploadImage(file, {
      onSuccess: (imageUrl) => {
        const newImages = [...(formData.images || [])];
        newImages[index] = imageUrl;
        handleInputChange('images', newImages);
        toast.success('Image uploaded successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to upload image');
      }
    });
  };

  const handleFileSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    handleImageUpload(index, file);
    if (event.target) event.target.value = '';
  };

  const addImage = () => {
    const newImages = [...(formData.images || []), ''];
    handleInputChange('images', newImages);
  };

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    const finalImages = newImages.length > 0 ? newImages : [''];
    handleInputChange('images', finalImages);
    fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  // Enhanced input styling with error states
  const getInputStyle = (fieldName: string, hasError: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '0.75rem 1rem',
    border: `2px solid ${hasError ? theme.colors.error : theme.colors.border}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontWeight: '400',
    boxShadow: hasError ? `0 0 0 3px ${theme.colors.error}15` : 'none',
  });

  const getSelectStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    border: `2px solid ${hasError ? theme.colors.error : theme.colors.border}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontWeight: '400',
    boxShadow: hasError ? `0 0 0 3px ${theme.colors.error}15` : 'none',
    cursor: 'pointer',
  });

  const getLabelStyle = (hasError: boolean): React.CSSProperties => ({
    fontWeight: '600',
    color: hasError ? theme.colors.error : theme.colors.text,
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s ease',
  });

  const getFieldContainerStyle = (hasError: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    animation: hasError && hasAttemptedSubmit ? 'shake 0.5s ease-in-out' : 'none',
  });

  // Theme-driven styles
  const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    backgroundColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  };

  const uploadButtonStyle = (isUploading: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: isUploading ? theme.colors.disabled : theme.colors.backgroundSecondary,
    color: theme.colors.text,
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    cursor: isUploading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    opacity: isUploading ? 0.7 : 1,
  });

  const removeButtonStyle: React.CSSProperties = {
    color: theme.colors.error,
    padding: '0.75rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: '1.125rem',
    margin: 0,
  };

  const imageRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  };

  const emptyStateStyle: React.CSSProperties = {
    padding: '1.5rem',
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: '12px',
    textAlign: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.textSecondary,
    fontWeight: '300',
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: theme.colors.error,
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    animation: 'fadeIn 0.3s ease',
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: theme.colors.surface,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const checkboxStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: theme.colors.primary,
  };

  const checkboxLabelStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: theme.colors.text,
    fontWeight: '500',
    cursor: 'pointer',
    userSelect: 'none',
  };

  // Animation keyframes
  const keyframes = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `;

  // Helper function to render field errors
  const renderFieldErrors = (fieldName: string) => {
    const errors = getFieldErrors(fieldName, allErrors);
    if (errors.length === 0) return null;

    return (
      <div>
        {errors.map((error, index) => (
          <div key={index} style={errorTextStyle}>
            <FiAlertTriangle size={12} />
            {error}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Product Name */}
        <div style={getFieldContainerStyle(hasFieldError('name', allErrors))}>
          <label style={getLabelStyle(hasFieldError('name', allErrors))}>
            Product Name
            <span style={{ color: theme.colors.error }}>*</span>
            {hasFieldError('name', allErrors) && <FiAlertTriangle size={14} />}
          </label>
          <input
            name="name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            style={getInputStyle('name', hasFieldError('name', allErrors))}
            onFocus={(e) => {
              if (!hasFieldError('name', allErrors)) {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
              }
            }}
            onBlur={(e) => {
              if (!hasFieldError('name', allErrors)) {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {renderFieldErrors('name')}
        </div>

        {/* Reference */}
        <div style={getFieldContainerStyle(hasFieldError('reference', allErrors))}>
          <label style={getLabelStyle(hasFieldError('reference', allErrors))}>
            Reference
            {hasFieldError('reference', allErrors) && <FiAlertTriangle size={14} />}
          </label>
          <input
            name="reference"
            type="text"
            value={formData.reference || ''}
            onChange={(e) => handleInputChange('reference', e.target.value)}
            placeholder="Enter reference (optional)"
            style={getInputStyle('reference', hasFieldError('reference', allErrors))}
            onFocus={(e) => {
              if (!hasFieldError('reference', allErrors)) {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
              }
            }}
            onBlur={(e) => {
              if (!hasFieldError('reference', allErrors)) {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {renderFieldErrors('reference')}
        </div>

        {/* Pricing */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={getFieldContainerStyle(hasFieldError('price', allErrors))}>
            <label style={getLabelStyle(hasFieldError('price', allErrors))}>
              Regular Price
              <span style={{ color: theme.colors.error }}>*</span>
              {hasFieldError('price', allErrors) && <FiAlertTriangle size={14} />}
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              style={getInputStyle('price', hasFieldError('price', allErrors))}
              onFocus={(e) => {
                if (!hasFieldError('price', allErrors)) {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
                }
              }}
              onBlur={(e) => {
                if (!hasFieldError('price', allErrors)) {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {renderFieldErrors('price')}
          </div>

          <div style={getFieldContainerStyle(hasFieldError('discountPrice', allErrors))}>
            <label style={getLabelStyle(hasFieldError('discountPrice', allErrors))}>
              Sale Price (Optional)
              {hasFieldError('discountPrice', allErrors) && <FiAlertTriangle size={14} />}
            </label>
            <input
              name="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.discountPrice || ''}
              onChange={(e) => handleInputChange('discountPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Optional discount price"
              style={getInputStyle('discountPrice', hasFieldError('discountPrice', allErrors))}
              onFocus={(e) => {
                if (!hasFieldError('discountPrice', allErrors)) {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
                }
              }}
              onBlur={(e) => {
                if (!hasFieldError('discountPrice', allErrors)) {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {renderFieldErrors('discountPrice')}
          </div>
        </div>

        {/* Description */}
        <div style={getFieldContainerStyle(hasFieldError('description', allErrors))}>
          <label style={getLabelStyle(hasFieldError('description', allErrors))}>
            Description
            {hasFieldError('description', allErrors) && <FiAlertTriangle size={14} />}
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your product in detail..."
            rows={4}
            style={{
              ...getInputStyle('description', hasFieldError('description', allErrors)),
              resize: 'vertical',
              minHeight: '100px',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              if (!hasFieldError('description', allErrors)) {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
              }
            }}
            onBlur={(e) => {
              if (!hasFieldError('description', allErrors)) {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {renderFieldErrors('description')}
        </div>

        {/* Offers Title */}
        <div style={getFieldContainerStyle(hasFieldError('offersTitle', allErrors))}>
          <label style={getLabelStyle(hasFieldError('offersTitle', allErrors))}>
            Offers Title
            {hasFieldError('offersTitle', allErrors) && <FiAlertTriangle size={14} />}
          </label>
          <input
            name="offersTitle"
            type="text"
            value={formData.offersTitle || ''}
            onChange={(e) => handleInputChange('offersTitle', e.target.value)}
            placeholder="Enter offers title (optional)"
            style={getInputStyle('offersTitle', hasFieldError('offersTitle', allErrors))}
            onFocus={(e) => {
              if (!hasFieldError('offersTitle', allErrors)) {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
              }
            }}
            onBlur={(e) => {
              if (!hasFieldError('offersTitle', allErrors)) {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {renderFieldErrors('offersTitle')}
        </div>

        {/* Offer Title Styling Options */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: theme.colors.backgroundSecondary, 
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}` 
        }}>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            fontWeight: '600',
            color: theme.colors.text 
          }}>
            Offer Title Styling
          </h4>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {/* Offer Title Font Family */}
            <div style={getFieldContainerStyle(hasFieldError('offerTitleFontFamily', allErrors))}>
              <label style={getLabelStyle(hasFieldError('offerTitleFontFamily', allErrors))}>
                Offer Title Font Family
                {hasFieldError('offerTitleFontFamily', allErrors) && <FiAlertTriangle size={14} />}
              </label>
              <select
                style={getSelectStyle(hasFieldError('offerTitleFontFamily', allErrors))}
                value={formData.offerTitleFontFamily || ''}
                onChange={(e) => handleInputChange('offerTitleFontFamily', e.target.value)}
              >
                {FONT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {renderFieldErrors('offerTitleFontFamily')}
            </div>

            {/* Offer Title Font Size */}
            <div style={getFieldContainerStyle(hasFieldError('offerTitleFontSize', allErrors))}>
              <label style={getLabelStyle(hasFieldError('offerTitleFontSize', allErrors))}>
                Offer Title Font Size (px)
                {hasFieldError('offerTitleFontSize', allErrors) && <FiAlertTriangle size={14} />}
              </label>
              <input
                type="number"
                style={getInputStyle('offerTitleFontSize', hasFieldError('offerTitleFontSize', allErrors))}
                value={formData.offerTitleFontSize || ''}
                onChange={(e) => handleInputChange('offerTitleFontSize', e.target.value)}
                placeholder="e.g., 20"
                min="1"
                onFocus={(e) => {
                  if (!hasFieldError('offerTitleFontSize', allErrors)) {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
                  }
                }}
                onBlur={(e) => {
                  if (!hasFieldError('offerTitleFontSize', allErrors)) {
                    e.target.style.borderColor = theme.colors.border;
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {renderFieldErrors('offerTitleFontSize')}
            </div>

            {/* Offer Title Font Weight */}
            <div style={getFieldContainerStyle(hasFieldError('offerTitleFontWeight', allErrors))}>
              <label style={getLabelStyle(hasFieldError('offerTitleFontWeight', allErrors))}>
                Offer Title Font Weight
                {hasFieldError('offerTitleFontWeight', allErrors) && <FiAlertTriangle size={14} />}
              </label>
              <select
                style={getSelectStyle(hasFieldError('offerTitleFontWeight', allErrors))}
                value={formData.offerTitleFontWeight || ''}
                onChange={(e) => handleInputChange('offerTitleFontWeight', e.target.value)}
              >
                {FONT_WEIGHT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {renderFieldErrors('offerTitleFontWeight')}
            </div>

            {/* Offer Title Color */}
            <div style={getFieldContainerStyle(hasFieldError('offerTitleColor', allErrors))}>
              <label style={getLabelStyle(hasFieldError('offerTitleColor', allErrors))}>
                Offer Title Color
                {hasFieldError('offerTitleColor', allErrors) && <FiAlertTriangle size={14} />}
              </label>
              <ColorInput 
                value={formData.offerTitleColor || ''}
                onChange={(value) => handleInputChange('offerTitleColor', value)}
              />
              {renderFieldErrors('offerTitleColor')}
            </div>
          </div>
        </div>
        <div style={{ 
  padding: '1.5rem', 
  backgroundColor: theme.colors.backgroundSecondary, 
  borderRadius: '12px',
  border: `1px solid ${theme.colors.border}` 
}}>
  <h3 style={{ 
    margin: '0 0 0.5rem 0', 
    fontSize: '1rem', 
    fontWeight: '600',
    color: theme.colors.text 
  }}>
    Background of Form
  </h3>
  <p style={{ 
    margin: '0 0 1rem 0', 
    fontSize: '0.85rem',
    color: theme.colors.textMuted,
    lineHeight: 1.5
  }}>
    Enter CSS background value (e.g., solid color, gradient, or any valid CSS background property)
  </p>
  
  <label style={{
    display: 'block',
    color: theme.colors.text,
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
  }}>
    Background CSS Code
  </label>
  <textarea
    style={{
      width: '100%',
      minHeight: '100px',
      padding: '0.75rem',
      fontSize: '0.9rem',
      fontFamily: 'monospace',
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '8px',
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
    }}
    value={formData.backgroundFormColor || ''}
    onChange={(e) => handleInputChange('backgroundFormColor', e.target.value)}
    placeholder="Example: linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5))"
    onFocus={(e) => {
      e.target.style.borderColor = theme.colors.primary;
      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
    }}
    onBlur={(e) => {
      e.target.style.borderColor = theme.colors.border;
      e.target.style.boxShadow = 'none';
    }}
  />
  
  <div style={{
    marginTop: '1rem',
    padding: '1rem',
    borderRadius: '8px',
    border: `2px solid ${theme.colors.border}`,
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: formData.backgroundFormColor || theme.colors.background,
  }}>
    <span style={{
      color: theme.colors.text,
      fontSize: '0.9rem',
      fontWeight: '500',
    }}>
      Background Preview
    </span>
  </div>
</div>
        {/* Thank You Checkbox */}
        <div 
          style={checkboxContainerStyle}
          onClick={() => handleInputChange('thankYou', !formData.thankYou)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
            e.currentTarget.style.borderColor = theme.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        >
          <input
            type="checkbox"
            checked={formData.thankYou || false}
            onChange={(e) => handleInputChange('thankYou', e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            style={checkboxStyle}
          />
          <label style={checkboxLabelStyle}>
          Show a ‘Return Home’ button In ThankYou Page
          </label>
        </div>

        {/* Product Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{
                ...sectionTitleStyle,
                color: hasFieldError('images', allErrors) ? theme.colors.error : theme.colors.text,
              }}>
                Product Images
                <span style={{ color: theme.colors.error }}>*</span>
              </h4>
              {hasFieldError('images', allErrors) && <FiAlertTriangle size={16} color={theme.colors.error} />}
            </div>
            <button
              type="button"
              onClick={addImage}
              style={addButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 4px 8px ${theme.colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 4px ${theme.colors.shadow}`;
              }}
            >
              <FiPlus size={14} />
              Add Image
            </button>
          </div>

          {(formData.images || []).length === 0 && (
            <div style={{
              ...emptyStateStyle,
              border: hasFieldError('images', allErrors) ? 
                `2px dashed ${theme.colors.error}` : 
                `2px dashed ${theme.colors.border}`,
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                No images added yet. Click "Add Image" to get started.
              </p>
            </div>
          )}

          {(formData.images || []).map((image, index) => {
            const fieldName = `images.${index}`;
            const fieldHasError =
              hasFieldError(fieldName, allErrors) ||
              (index === 0 && hasFieldError("images", allErrors));

            return (
              <div
                key={index}
                style={{
                  ...getFieldContainerStyle(fieldHasError),
                  padding: "1rem",
                  backgroundColor: theme.colors.surface,
                  borderRadius: "12px",
                  border: `1px solid ${
                    fieldHasError ? theme.colors.error : theme.colors.border
                  }`,
                }}
              >
                <label style={getLabelStyle(fieldHasError)}>
                  Image {index + 1}
                  {index === 0 && (
                    <span style={{ color: theme.colors.error }}>*</span>
                  )}
                  {fieldHasError && <FiAlertTriangle size={14} />}
                </label>

                <div style={imageRowStyle}>
                  {image && (
                    <img
                      src={import.meta.env.VITE_SERVER_URL + image}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  )}

                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="Image URL or upload a file"
                      style={getInputStyle(fieldName, fieldHasError)}
                      onFocus={(e) => {
                        if (!fieldHasError) {
                          e.target.style.borderColor = theme.colors.primary;
                          e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
                        }
                      }}
                      onBlur={(e) => {
                        if (!fieldHasError) {
                          e.target.style.borderColor = theme.colors.border;
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />

                    {image && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {image.startsWith("http") ? "URL: " : "Uploaded: "}
                        {image.length > 50
                          ? `${image.substring(0, 50)}...`
                          : image}
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    accept="image/*"
                    onChange={(e) => handleFileSelect(index, e)}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    onClick={() => triggerFileInput(index)}
                    disabled={isUploading}
                    style={uploadButtonStyle(isUploading)}
                    onMouseEnter={(e) => {
                      if (!isUploading) {
                        e.currentTarget.style.backgroundColor =
                          theme.colors.hover || theme.colors.backgroundSecondary;
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isUploading) {
                        e.currentTarget.style.backgroundColor =
                          theme.colors.backgroundSecondary;
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {isUploading ? (
                      <>
                        <FiLoader className="animate-spin" size={14} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload size={14} />
                        Upload
                      </>
                    )}
                  </button>

                  {(formData.images?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={removeButtonStyle}
                      title="Remove image"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>

                {renderFieldErrors(fieldName)}
                {index === 0 && renderFieldErrors("images")}
              </div>
            );
          })}
        </div>

        {/* Display consolidated errors for this tab */}
        {hasAttemptedSubmit && <ErrorDisplay errors={tabErrors} />}
      </div>
    </>
  );
};

export default BasicInfoTab;