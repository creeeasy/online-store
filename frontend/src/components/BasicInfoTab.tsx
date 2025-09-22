// src/components/ProductForm/BasicInfoTab.tsx
import React, { useRef } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiLoader } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import { FieldWrapper, ValidatedInput, ValidatedTextarea } from './ValidationErrorDisplay';
import { validateImageFile } from '../utils/fileUpload';
import { toast } from 'react-toastify';
import { useImageUpload } from '../hooks/useUpload';

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
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();

  const handleInputChange = (field: keyof IProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageUpload = (index: number, file: File) => {
    uploadImage(file, {
      onSuccess: (imageUrl) => {
        const newImages = [...(formData.images || [])];
        newImages[index] = imageUrl;
        setFormData(prev => ({ ...prev, images: newImages }));
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
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  // Theme-driven styles using your theme structure
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
    fontWeight: '500'
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
    opacity: isUploading ? 0.7 : 1
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
    justifyContent: 'center'
  };

  const imageInputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.75rem 1rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontWeight: '400'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: '1.125rem',
    margin: 0
  };

  const imageRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  };

  const imagePreviewStyle = (url: string): React.CSSProperties => ({
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`
  });

  const emptyStateStyle: React.CSSProperties = {
    padding: '1.5rem',
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: '12px',
    textAlign: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.textSecondary,
    fontWeight: '300'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      {/* Reference */}
      <ValidatedInput
        label="Reference"
        fieldName="reference"
        errors={validationErrors}
        required
        type="text"
        value={formData.reference || ''}
        onChange={(e) => handleInputChange('reference', e.target.value)}
        placeholder="Enter reference"
      />

      {/* Pricing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
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
          <div style={emptyStateStyle}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No images added yet. Click "Add Image" to get started.
            </p>
          </div>
        )}

        {(formData.images || []).map((image, index) => (
          <FieldWrapper
            key={index}
            label={`Image ${index + 1}`}
            fieldName={`images.${index}`}
            errors={validationErrors}
            required={index === 0}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={imageRowStyle}>
                {image && <div style={imagePreviewStyle(image)} />}
                
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="Image URL or upload a file"
                  style={imageInputStyle}
                />
                
                <input
                  type="file"
                  ref={(el) => fileInputRefs.current[index] = el}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(index, e)}
                  style={{ display: 'none' }}
                />
                
                <button
                  type="button"
                  onClick={() => triggerFileInput(index)}
                  disabled={isUploading}
                  style={uploadButtonStyle(isUploading)}
                  onMouseEnter={(e) => {
                    if (!isUploading) {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUploading) {
                      e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    }
                  }}
                >
                  {isUploading ? (
                    <FiLoader className="animate-spin" size={14} />
                  ) : (
                    <FiUpload size={14} />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>

                {(formData.images?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={removeButtonStyle}
                    title="Remove image"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
              
              {image && (
                <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>
                  {image.startsWith('http') ? 'URL: ' : 'Uploaded: '}
                  {image.length > 50 ? `${image.substring(0, 50)}...` : image}
                </div>
              )}
            </div>
          </FieldWrapper>
        ))}
      </div>
    </div>
  );
};

export default BasicInfoTab;