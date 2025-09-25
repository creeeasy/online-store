import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IOffer } from '../types/product';

interface OffersTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: any[];
  hasAttemptedSubmit: boolean;
}

const OffersTab: React.FC<OffersTabProps> = ({ 
  formData, 
  setFormData, 
  validationErrors,
  hasAttemptedSubmit 
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

  // Simple error checking - no complex extraction needed
  const hasFieldError = (fieldName: string): boolean => {
    return validationErrors?.some((error: any) => 
      error.field === fieldName || error.field?.startsWith(`${fieldName}.`)
    ) || false;
  };

  const getFieldErrors = (fieldName: string): string[] => {
    if (!validationErrors) return [];
    
    return validationErrors
      .filter((error: any) => 
        error.field === fieldName || error.field?.startsWith(`${fieldName}.`)
      )
      .map((error: any) => error.message);
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

  // Add new offer
  const addOffer = () => {
    if (!newOffer.title?.trim()) return;
    
    // Basic validation
    if (newOffer.originalPrice && newOffer.discountedPrice && 
        newOffer.discountedPrice >= newOffer.originalPrice) {
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
          _id: undefined // Remove ID for new duplicate
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
    borderColor: theme.colors.error
  };

  const addButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    backgroundColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...addButtonStyle,
    backgroundColor: theme.colors.disabled,
    cursor: 'not-allowed'
  };

  // Check if add button should be disabled
  const isAddDisabled = !newOffer.title?.trim();

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
          
          return (
            <div key={index} style={offerCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: '600' }}>Offer {index + 1}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => duplicateOffer(index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <FiPlus />
                  </button>
                  <button 
                    onClick={() => removeOffer(index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.error }}
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
                  style={hasFieldError(`offers.${index}.title`) ? errorInputStyle : inputStyle}
                />
                {hasFieldError(`offers.${index}.title`) && (
                  <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {getFieldErrors(`offers.${index}.title`)[0]}
                  </div>
                )}
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
                    value={offer.originalPrice || ''}
                    onChange={(e) => updateOffer(index, 'originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder={`Base: $${formData.price || 0}`}
                    style={hasFieldError(`offers.${index}.originalPrice`) ? errorInputStyle : inputStyle}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={offer.discountedPrice || ''}
                    onChange={(e) => updateOffer(index, 'discountedPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Sale price"
                    style={hasFieldError(`offers.${index}.discountedPrice`) ? errorInputStyle : inputStyle}
                  />
                </div>
              </div>

              {/* Price Display */}
              {(offer.originalPrice || offer.discountedPrice) && (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: theme.colors.backgroundSecondary, 
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  Customer pays: <strong>${getOfferFinalPrice(offer).toFixed(2)}</strong>
                  {savings.amount > 0 && (
                    <span style={{ color: theme.colors.success, marginLeft: '1rem' }}>
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
                    ...(hasFieldError(`offers.${index}.description`) ? errorInputStyle : inputStyle),
                    width: '100%',
                    resize: 'vertical'
                  }}
                />
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
                    style={hasFieldError(`offers.${index}.validUntil`) ? errorInputStyle : inputStyle}
                  />
                </div>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
      </div>

      {/* Add New Offer */}
      <div style={{ ...offerCardStyle, backgroundColor: theme.colors.backgroundSecondary }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Add New Offer</h4>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Offer Title *
          </label>
          <input
            type="text"
            value={newOffer.title || ''}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            placeholder="e.g., Summer Sale"
            style={hasFieldError('newOffer.title') ? errorInputStyle : inputStyle}
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
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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