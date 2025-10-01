import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiAlertTriangle, FiUpload, FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IOffer } from '../types/product';
import { getFieldErrors, hasFieldError } from '../utils/validation';

interface OffersTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors?: any; 
  hasAttemptedSubmit: boolean;
}

// Font family options (same as DynamicFieldsTab)
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

const OffersTab: React.FC<OffersTabProps> = ({ 
  formData, 
  setFormData, 
  validationErrors,
}) => {
  const { theme } = useTheme();
  const [newOffer, setNewOffer] = useState<Partial<IOffer>>({
    title: '',
    description: '',
    originalPrice: undefined,
    discountedPrice: undefined,
    isActive: true,
    reference: '',
    titleFontFamily: '',
    titleFontSize: '',
    titleFontBold: '',
    titleColor: '',
    descriptionFontFamily: '',
    descriptionFontSize: '',
    descriptionFontBold: '',
    descriptionColor: '',
    originalPriceFontFamily: '',
    originalPriceFontSize: '',
    originalPriceFontBold: '',
    originalPriceColor: '',
    discountedPriceFontFamily: '',
    discountedPriceFontSize: '',
    discountedPriceFontBold: '',
    discountedPriceColor: '',
    image: null
  });

  // Fixed: Properly handle both array and object validation error structures
  const getErrorsForField = (fieldName: string): string[] => {
    return getFieldErrors(fieldName, validationErrors);
  };

  const hasErrorForField = (fieldName: string): boolean => {
    return hasFieldError(fieldName, validationErrors);
  };

  // Simple offer stats
  const offerStats = {
    total: formData.offers?.length || 0,
    active: formData.offers?.filter(offer => offer.isActive).length || 0
  };

  // Simple price calculation
  const getOfferFinalPrice = (offer: IOffer): number => {
    return offer.discountedPrice || offer.originalPrice || formData.price || 0;
  };

  // Simple savings calculation
  const getOfferSavings = (offer: IOffer): { amount: number; percentage: number } => {
    const originalPrice = offer.originalPrice || formData.price || 0;
    const finalPrice = getOfferFinalPrice(offer);
    
    const amount = Math.max(0, originalPrice - finalPrice);
    const percentage = originalPrice > 0 ? Math.round((amount / originalPrice) * 100) : 0;
    
    return { amount, percentage };
  };

  // Handle image upload for new offer - convert to base64
  const handleNewOfferImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setNewOffer(prev => ({ 
          ...prev, 
          image: imageData // Store as base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image from new offer
  const removeNewOfferImage = () => {
    setNewOffer(prev => ({ 
      ...prev, 
      image: null
    }));
  };

  // Handle image upload for existing offer
  const handleExistingOfferImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        updateOffer(index, 'image', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image from existing offer
  const removeExistingOfferImage = (index: number) => {
    updateOffer(index, 'image', null);
  };

  // Add new offer with validation
  const addOffer = () => {
    if (!newOffer.title?.trim()) return;
    
    // Validate prices
    if (newOffer.originalPrice && newOffer.discountedPrice && 
        newOffer.discountedPrice >= newOffer.originalPrice) {
      alert('Discounted price must be less than original price');
      return;
    }
    
    // Validate required fields
    if (!newOffer.title.trim()) {
      alert('Offer title is required');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      offers: [...(prev.offers || []), { 
        title: newOffer.title || '',
        description: newOffer.description || '',
        originalPrice: newOffer.originalPrice,
        discountedPrice: newOffer.discountedPrice,
        isActive: newOffer.isActive !== false,
        reference: newOffer.reference || '',
        titleFontFamily: newOffer.titleFontFamily || '',
        titleFontSize: newOffer.titleFontSize || '',
        titleFontBold: newOffer.titleFontBold || '',
        titleColor: newOffer.titleColor || '',
        descriptionFontFamily: newOffer.descriptionFontFamily || '',
        descriptionFontSize: newOffer.descriptionFontSize || '',
        descriptionFontBold: newOffer.descriptionFontBold || '',
        descriptionColor: newOffer.descriptionColor || '',
        originalPriceFontFamily: newOffer.originalPriceFontFamily || '',
        originalPriceFontSize: newOffer.originalPriceFontSize || '',
        originalPriceFontBold: newOffer.originalPriceFontBold || '',
        originalPriceColor: newOffer.originalPriceColor || '',
        discountedPriceFontFamily: newOffer.discountedPriceFontFamily || '',
        discountedPriceFontSize: newOffer.discountedPriceFontSize || '',
        discountedPriceFontBold: newOffer.discountedPriceFontBold || '',
        discountedPriceColor: newOffer.discountedPriceColor || '',
        image: newOffer.image || null
      } as IOffer]
    }));
    
    // Reset form
    setNewOffer({
      title: '',
      description: '',
      originalPrice: undefined,
      discountedPrice: undefined,
      isActive: true,
      reference: '',
      titleFontFamily: '',
      titleFontSize: '',
      titleFontBold: '',
      titleColor: '',
      descriptionFontFamily: '',
      descriptionFontSize: '',
      descriptionFontBold: '',
      descriptionColor: '',
      originalPriceFontFamily: '',
      originalPriceFontSize: '',
      originalPriceFontBold: '',
      originalPriceColor: '',
      discountedPriceFontFamily: '',
      discountedPriceFontSize: '',
      discountedPriceFontBold: '',
      discountedPriceColor: '',
      image: null
    });
  };

  // Update existing offer
  const updateOffer = (index: number, field: string, value: any) => {
    const newOffers = [...(formData.offers || [])];
    newOffers[index] = { ...newOffers[index], [field]: value };
    setFormData(prev => ({ ...prev, offers: newOffers }));
  };

  // Remove offer
  const removeOffer = (index: number) => {
    const newOffers = (formData.offers || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, offers: newOffers }));
  };

  // Duplicate offer
  const duplicateOffer = (index: number) => {
    const offerToCopy = (formData.offers || [])[index];
    if (offerToCopy) {
      setFormData(prev => ({
        ...prev,
        offers: [...(prev.offers || []), {
          ...offerToCopy,
          title: `${offerToCopy.title} (Copy)`,
          reference: offerToCopy.reference ? `${offerToCopy.reference}-copy` : '',
          _id: undefined,
          image: null // Don't duplicate image
        }]
      }));
    }
  };

  // Simple styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: theme.colors.text,
    margin: 0
  };

  const offerCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '1.5rem',
    backgroundColor: theme.colors.surface
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text
  };

  const errorInputStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: theme.colors.error,
    boxShadow: `0 0 0 2px ${theme.colors.error}20`
  };

  const errorTextStyle: React.CSSProperties = {
    color: theme.colors.error,
    fontSize: '0.8rem',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  };

  const addButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    backgroundColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...addButtonStyle,
    backgroundColor: theme.colors.disabled,
    cursor: 'not-allowed',
    opacity: 0.6
  };

  const fontPreviewStyle: React.CSSProperties = {
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: theme.colors.backgroundSecondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '1rem',
    color: theme.colors.text,
  };

  const colorInputContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const colorTextInputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.75rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: 'monospace'
  };

  const colorPickerStyle: React.CSSProperties = {
    width: '42px',
    height: '42px',
    padding: '0.25rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: theme.colors.surface
  };

  const imageUploadContainerStyle: React.CSSProperties = {
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: theme.colors.backgroundSecondary
  };

  const imagePreviewContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    marginTop: '0.5rem'
  };

  const imagePreviewStyle: React.CSSProperties = {
    maxWidth: '200px',
    maxHeight: '150px',
    borderRadius: '6px',
    objectFit: 'cover'
  };

  const removeImageButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: theme.colors.error,
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const fileInputStyle: React.CSSProperties = {
    display: 'none'
  };

  // Check if add button should be disabled
  const isAddDisabled = !newOffer.title?.trim();

  // Render error messages for a field
  const renderFieldErrors = (fieldName: string) => {
    const errors = getErrorsForField(fieldName);
    if (errors.length === 0) return null;

    return (
      <div style={errorTextStyle}>
        <FiAlertTriangle size={12} />
        {errors[0]} {/* Show first error only for simplicity */}
      </div>
    );
  };

  // Color input component with both text and picker
  const ColorInput = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
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

  // Image upload component
  const ImageUpload = ({ 
    image, 
    onImageChange, 
    onImageRemove 
  }: { 
    image: string | null; 
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
    onImageRemove: () => void; 
  }) => (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        Offer Image
      </label>
      
      {image ? (
        <div style={imagePreviewContainerStyle}>
          <img 
            src={image} 
            alt="Offer preview" 
            style={imagePreviewStyle}
          />
          <button 
            type="button"
            onClick={onImageRemove}
            style={removeImageButtonStyle}
            title="Remove image"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <label style={imageUploadContainerStyle}>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            style={fileInputStyle}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <FiUpload size={24} color={theme.colors.textSecondary} />
            <div style={{ color: theme.colors.textSecondary }}>
              Click to upload offer image
            </div>
            <div style={{ fontSize: '0.8rem', color: theme.colors.textSecondary }}>
              JPG, PNG, WEBP (Max 5MB)
            </div>
          </div>
        </label>
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        Special Offers ({offerStats.total} total, {offerStats.active} active)
      </div>

      {/* Existing Offers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(formData.offers || []).map((offer, index) => {
          const savings = getOfferSavings(offer);
          const fieldPrefix = `offers.${index}`;
          
          return (
            <div key={index} style={offerCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: '600' }}>Offer {index + 1}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => duplicateOffer(index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.textSecondary }}
                    title="Duplicate offer"
                  >
                    <FiPlus />
                  </button>
                  <button 
                    onClick={() => removeOffer(index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.error }}
                    title="Remove offer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {/* Offer Image */}
              <div style={{ marginBottom: '1rem' }}>
                <ImageUpload 
                  image={offer.image || null}
                  onImageChange={(e) => handleExistingOfferImageUpload(index, e)}
                  onImageRemove={() => removeExistingOfferImage(index)}
                />
              </div>

              {/* Offer Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => updateOffer(index, 'title', e.target.value)}
                  placeholder="e.g., Black Friday Sale"
                  style={hasErrorForField(`${fieldPrefix}.title`) ? errorInputStyle : inputStyle}
                />
                {renderFieldErrors(`${fieldPrefix}.title`)}
              </div>

              {/* Title Font Customization */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Title Font Family
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.titleFontFamily || ''}
                    onChange={(e) => updateOffer(index, 'titleFontFamily', e.target.value)}
                  >
                    {FONT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Title Font Size (px)
                  </label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={offer.titleFontSize || ''}
                    onChange={(e) => updateOffer(index, 'titleFontSize', e.target.value)}
                    placeholder="e.g., 24"
                    min="1"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Title Font Weight
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.titleFontBold || ''}
                    onChange={(e) => updateOffer(index, 'titleFontBold', e.target.value)}
                  >
                    {FONT_WEIGHT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Title Color
                  </label>
                  <ColorInput 
                    value={offer.titleColor || ''} 
                    onChange={(value) => updateOffer(index, 'titleColor', value)} 
                  />
                </div>
              </div>

              {/* Title Font Preview */}
              {(offer.titleFontFamily || offer.titleFontSize || offer.titleFontBold || offer.titleColor) && (
                <div style={{ 
                  ...fontPreviewStyle, 
                  fontFamily: offer.titleFontFamily || 'inherit',
                  fontSize: offer.titleFontSize ? `${offer.titleFontSize}px` : '1rem',
                  fontWeight: offer.titleFontBold || 'normal',
                  color: offer.titleColor || 'inherit'
                }}>
                  Preview: {offer.title || 'Sample title text'}
                </div>
              )}

              {/* Reference Input */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Reference
                </label>
                <input
                  type="text"
                  value={offer.reference || ''}
                  onChange={(e) => updateOffer(index, 'reference', e.target.value)}
                  placeholder="e.g., BF2024, SUMMER50"
                  style={hasErrorForField(`${fieldPrefix}.reference`) ? errorInputStyle : inputStyle}
                />
                {renderFieldErrors(`${fieldPrefix}.reference`)}
              </div>

              {/* Prices */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={offer.originalPrice || ''}
                    onChange={(e) => updateOffer(index, 'originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder={`Base: $${formData.price || 0}`}
                    style={hasErrorForField(`${fieldPrefix}.originalPrice`) ? errorInputStyle : inputStyle}
                  />
                  {renderFieldErrors(`${fieldPrefix}.originalPrice`)}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={offer.discountedPrice || ''}
                    onChange={(e) => updateOffer(index, 'discountedPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Sale price"
                    style={hasErrorForField(`${fieldPrefix}.discountedPrice`) ? errorInputStyle : inputStyle}
                  />
                  {renderFieldErrors(`${fieldPrefix}.discountedPrice`)}
                </div>
              </div>

              {/* Original Price Font Customization */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Original Price Font Family
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.originalPriceFontFamily || ''}
                    onChange={(e) => updateOffer(index, 'originalPriceFontFamily', e.target.value)}
                  >
                    {FONT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Original Price Font Size (px)
                  </label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={offer.originalPriceFontSize || ''}
                    onChange={(e) => updateOffer(index, 'originalPriceFontSize', e.target.value)}
                    placeholder="e.g., 18"
                    min="1"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Original Price Font Weight
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.originalPriceFontBold || ''}
                    onChange={(e) => updateOffer(index, 'originalPriceFontBold', e.target.value)}
                  >
                    {FONT_WEIGHT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Original Price Color
                  </label>
                  <ColorInput 
                    value={offer.originalPriceColor || ''} 
                    onChange={(value) => updateOffer(index, 'originalPriceColor', value)} 
                  />
                </div>
              </div>

              {/* Discounted Price Font Customization */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Discounted Price Font Family
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.discountedPriceFontFamily || ''}
                    onChange={(e) => updateOffer(index, 'discountedPriceFontFamily', e.target.value)}
                  >
                    {FONT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Discounted Price Font Size (px)
                  </label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={offer.discountedPriceFontSize || ''}
                    onChange={(e) => updateOffer(index, 'discountedPriceFontSize', e.target.value)}
                    placeholder="e.g., 20"
                    min="1"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Discounted Price Font Weight
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.discountedPriceFontBold || ''}
                    onChange={(e) => updateOffer(index, 'discountedPriceFontBold', e.target.value)}
                  >
                    {FONT_WEIGHT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Discounted Price Color
                  </label>
                  <ColorInput 
                    value={offer.discountedPriceColor || ''} 
                    onChange={(value) => updateOffer(index, 'discountedPriceColor', value)} 
                  />
                </div>
              </div>

              {/* Price Display */}
              {(offer.originalPrice || offer.discountedPrice || formData.price) && (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: theme.colors.backgroundSecondary, 
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  Customer pays: <strong>${getOfferFinalPrice(offer).toFixed(2)}</strong>
                  {savings.amount > 0 && (
                    <span style={{ color: theme.colors.success, marginLeft: '1rem', fontWeight: '500' }}>
                      Save ${savings.amount.toFixed(2)} ({savings.percentage}%)
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={offer.description || ''}
                  onChange={(e) => updateOffer(index, 'description', e.target.value)}
                  placeholder="Offer details..."
                  rows={3}
                  style={{
                    ...(hasErrorForField(`${fieldPrefix}.description`) ? errorInputStyle : inputStyle),
                    width: '100%',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                {renderFieldErrors(`${fieldPrefix}.description`)}
              </div>

              {/* Description Font Customization */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Description Font Family
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.descriptionFontFamily || ''}
                    onChange={(e) => updateOffer(index, 'descriptionFontFamily', e.target.value)}
                  >
                    {FONT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Description Font Size (px)
                  </label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={offer.descriptionFontSize || ''}
                    onChange={(e) => updateOffer(index, 'descriptionFontSize', e.target.value)}
                    placeholder="e.g., 14"
                    min="1"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Description Font Weight
                  </label>
                  <select
                    style={inputStyle}
                    value={offer.descriptionFontBold || ''}
                    onChange={(e) => updateOffer(index, 'descriptionFontBold', e.target.value)}
                  >
                    {FONT_WEIGHT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Description Color
                  </label>
                  <ColorInput 
                    value={offer.descriptionColor || ''} 
                    onChange={(value) => updateOffer(index, 'descriptionColor', value)} 
                  />
                </div>
              </div>

              {/* Description Font Preview */}
              {(offer.descriptionFontFamily || offer.descriptionFontSize || offer.descriptionFontBold || offer.descriptionColor) && (
                <div style={{ 
                  ...fontPreviewStyle, 
                  fontFamily: offer.descriptionFontFamily || 'inherit',
                  fontSize: offer.descriptionFontSize ? `${offer.descriptionFontSize}px` : '1rem',
                  fontWeight: offer.descriptionFontBold || 'normal',
                  color: offer.descriptionColor || 'inherit'
                }}>
                  Preview: {offer.description || 'Sample description text'}
                </div>
              )}

              {/* Active Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={offer.isActive}
                    onChange={(e) => updateOffer(index, 'isActive', e.target.checked)}
                  />
                  Active
                </label>
              </div>
            </div>
          );
        })}

        {(formData.offers || []).length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: theme.colors.textSecondary,
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: '8px',
            border: `2px dashed ${theme.colors.border}`
          }}>
            No offers created yet. Add your first offer below.
          </div>
        )}
      </div>

      {/* Add New Offer */}
      <div style={{ ...offerCardStyle, backgroundColor: theme.colors.backgroundSecondary }}>
        <h4 style={{ margin: '0 0 1rem 0', color: theme.colors.text }}>Add New Offer</h4>
        
        {/* Offer Image for New Offer */}
        <div style={{ marginBottom: '1rem' }}>
          <ImageUpload 
            image={newOffer.image || null}
            onImageChange={handleNewOfferImageUpload}
            onImageRemove={removeNewOfferImage}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Offer Title *
          </label>
          <input
            type="text"
            value={newOffer.title || ''}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            placeholder="e.g., Summer Sale"
            style={hasErrorForField('newOffer.title') ? errorInputStyle : inputStyle}
          />
          {renderFieldErrors('newOffer.title')}
        </div>

        {/* Title Font Customization for New Offer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Title Font Family
            </label>
            <select
              style={inputStyle}
              value={newOffer.titleFontFamily || ''}
              onChange={(e) => setNewOffer({ ...newOffer, titleFontFamily: e.target.value })}
            >
              {FONT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Title Font Size (px)
            </label>
            <input
              type="number"
              style={inputStyle}
              value={newOffer.titleFontSize || ''}
              onChange={(e) => setNewOffer({ ...newOffer, titleFontSize: e.target.value })}
              placeholder="e.g., 24"
              min="1"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Title Font Weight
            </label>
            <select
              style={inputStyle}
              value={newOffer.titleFontBold || ''}
              onChange={(e) => setNewOffer({ ...newOffer, titleFontBold: e.target.value })}
            >
              {FONT_WEIGHT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Title Color
            </label>
            <ColorInput 
              value={newOffer.titleColor || ''} 
              onChange={(value) => setNewOffer({ ...newOffer, titleColor: value })} 
            />
          </div>
        </div>

        {/* Title Font Preview for New Offer */}
        {(newOffer.titleFontFamily || newOffer.titleFontSize || newOffer.titleFontBold || newOffer.titleColor) && (
          <div style={{ 
            ...fontPreviewStyle, 
            fontFamily: newOffer.titleFontFamily || 'inherit',
            fontSize: newOffer.titleFontSize ? `${newOffer.titleFontSize}px` : '1rem',
            fontWeight: newOffer.titleFontBold || 'normal',
            color: newOffer.titleColor || 'inherit'
          }}>
            Preview: {newOffer.title || 'Sample title text'}
          </div>
        )}

        {/* Reference Input for New Offer */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Reference
          </label>
          <input
            type="text"
            value={newOffer.reference || ''}
            onChange={(e) => setNewOffer({ ...newOffer, reference: e.target.value })}
            placeholder="e.g., SUMMER2024, SAVE20"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Original Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newOffer.originalPrice || ''}
              onChange={(e) => setNewOffer({ ...newOffer, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder={`Base: ${formData.price || 0}`}
              style={inputStyle}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Discounted Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newOffer.discountedPrice || ''}
              onChange={(e) => setNewOffer({ ...newOffer, discountedPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Sale price"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Original Price Font Customization for New Offer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Original Price Font Family
            </label>
            <select
              style={inputStyle}
              value={newOffer.originalPriceFontFamily || ''}
              onChange={(e) => setNewOffer({ ...newOffer, originalPriceFontFamily: e.target.value })}
            >
              {FONT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Original Price Font Size (px)
            </label>
            <input
              type="number"
              style={inputStyle}
              value={newOffer.originalPriceFontSize || ''}
              onChange={(e) => setNewOffer({ ...newOffer, originalPriceFontSize: e.target.value })}
              placeholder="e.g., 18"
              min="1"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Original Price Font Weight
            </label>
            <select
              style={inputStyle}
              value={newOffer.originalPriceFontBold || ''}
              onChange={(e) => setNewOffer({ ...newOffer, originalPriceFontBold: e.target.value })}
            >
              {FONT_WEIGHT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Original Price Color
            </label>
            <ColorInput 
              value={newOffer.originalPriceColor || ''} 
              onChange={(value) => setNewOffer({ ...newOffer, originalPriceColor: value })} 
            />
          </div>
        </div>

        {/* Discounted Price Font Customization for New Offer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Discounted Price Font Family
            </label>
            <select
              style={inputStyle}
              value={newOffer.discountedPriceFontFamily || ''}
              onChange={(e) => setNewOffer({ ...newOffer, discountedPriceFontFamily: e.target.value })}
            >
              {FONT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Discounted Price Font Size (px)
            </label>
            <input
              type="number"
              style={inputStyle}
              value={newOffer.discountedPriceFontSize || ''}
              onChange={(e) => setNewOffer({ ...newOffer, discountedPriceFontSize: e.target.value })}
              placeholder="e.g., 20"
              min="1"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Discounted Price Font Weight
            </label>
            <select
              style={inputStyle}
              value={newOffer.discountedPriceFontBold || ''}
              onChange={(e) => setNewOffer({ ...newOffer, discountedPriceFontBold: e.target.value })}
            >
              {FONT_WEIGHT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Discounted Price Color
            </label>
            <ColorInput 
              value={newOffer.discountedPriceColor || ''} 
              onChange={(value) => setNewOffer({ ...newOffer, discountedPriceColor: value })} 
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Description
          </label>
          <textarea
            value={newOffer.description || ''}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
            placeholder="Offer details..."
            rows={2}
            style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
          />
        </div>

        {/* Description Font Customization for New Offer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description Font Family
            </label>
            <select
              style={inputStyle}
              value={newOffer.descriptionFontFamily || ''}
              onChange={(e) => setNewOffer({ ...newOffer, descriptionFontFamily: e.target.value })}
            >
              {FONT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description Font Size (px)
            </label>
            <input
              type="number"
              style={inputStyle}
              value={newOffer.descriptionFontSize || ''}
              onChange={(e) => setNewOffer({ ...newOffer, descriptionFontSize: e.target.value })}
              placeholder="e.g., 14"
              min="1"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description Font Weight
            </label>
            <select
              style={inputStyle}
              value={newOffer.descriptionFontBold || ''}
              onChange={(e) => setNewOffer({ ...newOffer, descriptionFontBold: e.target.value })}
            >
              {FONT_WEIGHT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description Color
            </label>
            <ColorInput 
              value={newOffer.descriptionColor || ''} 
              onChange={(value) => setNewOffer({ ...newOffer, descriptionColor: value })} 
            />
          </div>
        </div>

        {/* Description Font Preview for New Offer */}
        {(newOffer.descriptionFontFamily || newOffer.descriptionFontSize || newOffer.descriptionFontBold || newOffer.descriptionColor) && (
          <div style={{ 
            ...fontPreviewStyle, 
            fontFamily: newOffer.descriptionFontFamily || 'inherit',
            fontSize: newOffer.descriptionFontSize ? `${newOffer.descriptionFontSize}px` : '1rem',
            fontWeight: newOffer.descriptionFontBold || 'normal',
            color: newOffer.descriptionColor || 'inherit'
          }}>
            Preview: {newOffer.description || 'Sample description text'}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={newOffer.isActive !== false}
              onChange={(e) => setNewOffer({ ...newOffer, isActive: e.target.checked })}
            />
            Active
          </label>
        </div>

        <button
          onClick={addOffer}
          disabled={isAddDisabled}
          style={isAddDisabled ? disabledButtonStyle : addButtonStyle}
        >
          <FiPlus /> Add Offer
        </button>
      </div>
    </div>
  );
};

export default OffersTab;