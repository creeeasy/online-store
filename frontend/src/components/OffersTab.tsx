import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IOffer } from '../types/product';
import { getFieldErrors, hasFieldError } from '../utils/validation';

interface OffersTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors?: any; 
  hasAttemptedSubmit: boolean;
}

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
    validUntil: undefined
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
    active: formData.offers?.filter(offer => offer.isActive).length || 0,
    expired: formData.offers?.filter(offer => 
      offer.validUntil && new Date(offer.validUntil) <= new Date()
    ).length || 0
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

  // Check if offer is expired
  const isOfferExpired = (offer: IOffer): boolean => {
    return offer.validUntil ? new Date(offer.validUntil) <= new Date() : false;
  };

  // Add new offer with validation
  const addOffer = () => {
    if (!newOffer.title?.trim()) return;
    
    // Validate prices
    if (newOffer.originalPrice && newOffer.discountedPrice && 
        newOffer.discountedPrice >= newOffer.originalPrice) {
      return;
    }
    
    // Validate required fields
    if (!newOffer.title.trim()) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      offers: [...(prev.offers || []), { 
        title: newOffer.title || '',
        description: newOffer.description || '',
        originalPrice: newOffer.originalPrice,
        discountedPrice: newOffer.discountedPrice,
        validUntil: newOffer.validUntil,
        isActive: newOffer.isActive !== false
      } as IOffer]
    }));
    
    // Reset form
    setNewOffer({
      title: '',
      description: '',
      originalPrice: undefined,
      discountedPrice: undefined,
      isActive: true,
      validUntil: undefined
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
          _id: undefined
        }]
      }));
    }
  };

  // Format date for input
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().slice(0, 16);
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        Special Offers ({offerStats.total} total, {offerStats.active} active)
      </div>

      {/* Existing Offers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(formData.offers || []).map((offer, index) => {
          const expired = isOfferExpired(offer);
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

              {/* Valid Until & Active Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Valid Until
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(offer.validUntil)}
                    onChange={(e) => updateOffer(index, 'validUntil', e.target.value ? new Date(e.target.value) : undefined)}
                    style={hasErrorForField(`${fieldPrefix}.validUntil`) ? errorInputStyle : inputStyle}
                  />
                  {renderFieldErrors(`${fieldPrefix}.validUntil`)}
                </div>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={offer.isActive}
                    onChange={(e) => updateOffer(index, 'isActive', e.target.checked)}
                  />
                  Active
                </label>
              </div>

              {expired && (
                <div style={{ 
                  color: theme.colors.error, 
                  fontSize: '0.8rem', 
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FiAlertTriangle /> This offer has expired
                </div>
              )}
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
              placeholder={`Base: $${formData.price || 0}`}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Valid Until
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(newOffer.validUntil)}
              onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value ? new Date(e.target.value) : undefined })}
              style={inputStyle}
            />
          </div>
          
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