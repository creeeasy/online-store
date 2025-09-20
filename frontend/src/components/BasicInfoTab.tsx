import React from 'react';
import {  FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import { FieldWrapper, ValidatedInput, ValidatedTextarea } from './ValidationErrorDisplay';

interface BasicInfoTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  formData, 
  setFormData, 
  validationErrors 
}) => {
  const { theme } = useTheme();

  const handleInputChange = (field: keyof IProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // Styled components using theme
  const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: '0.875rem',
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.lg,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: theme.fonts.medium
  };

  const removeButtonStyle: React.CSSProperties = {
    color: '#ef4444',
    padding: theme.spacing.sm,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: theme.borderRadius.md,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const imageInputStyle: React.CSSProperties = {
    flex: 1,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    fontSize: '1.125rem',
    margin: 0
  };

  const imageRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center'
  };

  const priceGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.lg
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
      {/* Product Name */}
      <ValidatedInput
        label="Product Name"
        fieldName="name"
        errors={validationErrors}
        required
        type="text"
        value={formData.name || ''}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Enter product name"
      />

      {/* Pricing */}
      <div style={priceGridStyle}>
        <ValidatedInput
          label="Regular Price"
          fieldName="price"
          errors={validationErrors}
          required
          type="number"
          min="0"
          step="0.01"
          value={formData.price || ''}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />

        <ValidatedInput
          label="Sale Price (Optional)"
          fieldName="discountPrice"
          errors={validationErrors}
          type="number"
          min="0"
          step="0.01"
          value={formData.discountPrice || ''}
          onChange={(e) => handleInputChange('discountPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="Optional discount price"
        />
      </div>

      {/* Description */}
      <ValidatedTextarea
        label="Description"
        fieldName="description"
        errors={validationErrors}
        required
        value={formData.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Describe your product in detail..."
        rows={4}
      />

      {/* Product Images */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        <div style={sectionHeaderStyle}>
          <h4 style={sectionTitleStyle}>Product Images</h4>
          <button
            type="button"
            onClick={addImage}
            style={addButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            <FiPlus size={14} />
            Add Image
          </button>
        </div>

        {(formData.images || []).length === 0 && (
          <div style={{
            padding: theme.spacing.lg,
            border: `2px dashed ${theme.colors.border}`,
            borderRadius: theme.borderRadius.lg,
            textAlign: 'center',
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textSecondary
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No images added yet. Click "Add Image" to get started.
            </p>
          </div>
        )}

        {(formData.images || []).map((image, index) => (
          <FieldWrapper
            key={index}
            label={`Image ${index + 1} URL`}
            fieldName={`images.${index}`}
            errors={validationErrors}
            required={index === 0}
          >
            <div style={imageRowStyle}>
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={imageInputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              {(formData.images?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={removeButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Remove image"
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          </FieldWrapper>
        ))}
      </div>
    </div>
  );
};

export default BasicInfoTab;