// src/components/ProductForm/BasicInfoTab.tsx - Enhanced with frontend validation
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

  const imagePreviewStyle = (url: string): React.CSSProperties => ({
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  });

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
            <span style={{ color: theme.colors.error }}>*</span>
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
            const fieldHasError = hasFieldError(fieldName, allErrors) || (index === 0 && hasFieldError('images', allErrors));
            
            return (
              <div
                key={index}
                style={{
                  ...getFieldContainerStyle(fieldHasError),
                  padding: '1rem',
                  backgroundColor: theme.colors.surface,
                  borderRadius: '12px',
                  border: `1px solid ${fieldHasError ? theme.colors.error : theme.colors.border}`,
                }}
              >
                <label style={getLabelStyle(fieldHasError)}>
                  Image {index + 1}
                  {index === 0 && <span style={{ color: theme.colors.error }}>*</span>}
                  {fieldHasError && <FiAlertTriangle size={14} />}
                </label>
                
                <div style={imageRowStyle}>
                  {image && <div style={imagePreviewStyle(image)} />}
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    />
                    
                    {image && (
                      <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>
                        {image.startsWith('http') ? 'URL: ' : 'Uploaded: '}
                        {image.length > 50 ? `${image.substring(0, 50)}...` : image}
                      </div>
                    )}
                  </div>
                  
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
                        e.currentTarget.style.backgroundColor = theme.colors.hover || theme.colors.backgroundSecondary;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isUploading) {
                        e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                        e.currentTarget.style.transform = 'translateY(0)';
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
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                
                {renderFieldErrors(fieldName)}
                {index === 0 && renderFieldErrors('images')}
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