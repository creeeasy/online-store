import React, { useState, useMemo } from 'react';
import { FiTrash2, FiPlus, FiPercent, FiCalendar, FiInfo, FiEye, FiEyeOff, FiDollarSign } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IOffer } from '../types/product';
import { ValidatedInput, ValidatedTextarea, ValidatedCheckbox } from './ValidationErrorDisplay';
import { OrderInquiryUtils, PRODUCT_LIMITS } from '../utils/orderInquiryUtils';
//import { OrderInquiryUtils, PRODUCT_LIMITS } from '../types/product';
interface OffersTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const OffersTab: React.FC<OffersTabProps> = ({ formData, setFormData, validationErrors }) => {
  const { theme } = useTheme();
  // ✅ Fixed: Updated newOffer state to match backend IOffer structure
  const [newOffer, setNewOffer] = useState<Partial<IOffer>>({
    title: '',
    description: '',
    originalPrice: undefined,
    discountedPrice: undefined,
    isActive: true,
    validUntil: undefined
  });

  // ✅ Fixed: Calculate offer statistics using new pricing structure
  const offerStats = useMemo(() => {
    const offers = formData.offers || [];
    const activeOffers = offers.filter(offer => offer.isActive);
    const expiredOffers = offers.filter(offer => 
      offer.validUntil && new Date(offer.validUntil) <= new Date()
    );
    
    // Calculate average savings instead of discount percentage
    const offersWithSavings = offers.filter(offer => 
      offer.originalPrice && offer.discountedPrice && 
      offer.originalPrice > offer.discountedPrice
    );
    
    const avgSavings = offersWithSavings.length > 0 
      ? Math.round(offersWithSavings.reduce((sum, offer) => {
          const savings = (offer.originalPrice! - offer.discountedPrice!) / offer.originalPrice! * 100;
          return sum + savings;
        }, 0) / offersWithSavings.length)
      : 0;
    
    return {
      total: offers.length,
      active: activeOffers.length,
      expired: expiredOffers.length,
      avgSavings: avgSavings
    };
  }, [formData.offers]);

  // ✅ Fixed: Calculate final price for offers using new structure
  const getOfferFinalPrice = (offer: IOffer): number => {
    // If offer has discounted price, use it
    if (offer.discountedPrice) {
      return offer.discountedPrice;
    }
    
    // Otherwise, use product's effective price
    if (!formData.price) return 0;
    return OrderInquiryUtils.getEffectivePrice({
      price: formData.price,
      discountPrice: formData.discountPrice
    } as IProduct);
  };

  // ✅ Fixed: Calculate savings amount
  const getOfferSavings = (offer: IOffer): { amount: number; percentage: number } => {
    const originalPrice = offer.originalPrice || formData.price || 0;
    const finalPrice = offer.discountedPrice || OrderInquiryUtils.getEffectivePrice({
      price: formData.price,
      discountPrice: formData.discountPrice
    } as IProduct);
    
    const amount = Math.max(0, originalPrice - finalPrice);
    const percentage = originalPrice > 0 ? Math.round((amount / originalPrice) * 100) : 0;
    
    return { amount, percentage };
  };

  // ✅ Fixed: Validation for adding offers
  const addOffer = () => {
    if (!newOffer.title?.trim()) return;
    
    // Validate that we have proper pricing structure
    if (!newOffer.originalPrice && !newOffer.discountedPrice) {
      // If no prices specified, skip this offer
      return;
    }
    
    // Validate pricing logic
    if (newOffer.originalPrice && newOffer.discountedPrice && 
        newOffer.discountedPrice >= newOffer.originalPrice) {
      return; // Invalid pricing
    }
    
    setFormData(prev => ({
      ...prev,
      offers: [...(prev.offers || []), { ...newOffer } as IOffer]
    }));
    
    setNewOffer({
      title: '',
      description: '',
      originalPrice: undefined,
      discountedPrice: undefined,
      isActive: true,
      validUntil: undefined
    });
  };

  const updateOffer = (index: number, field: string, value: any) => {
    const newOffers = [...(formData.offers || [])];
    newOffers[index] = { ...newOffers[index], [field]: value };
    setFormData(prev => ({ ...prev, offers: newOffers }));
  };

  const removeOffer = (index: number) => {
    const newOffers = (formData.offers || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, offers: newOffers }));
  };

  const duplicateOffer = (index: number) => {
    const offerToCopy = (formData.offers || [])[index];
    if (offerToCopy) {
      const duplicated = {
        ...offerToCopy,
        title: `${offerToCopy.title} (Copy)`,
        _id: undefined // Remove ID for new offer
      };
      setFormData(prev => ({
        ...prev,
        offers: [...(prev.offers || []), duplicated]
      }));
    }
  };

  // Check if offer is expired
  const isOfferExpired = (offer: IOffer): boolean => {
    return offer.validUntil ? new Date(offer.validUntil) <= new Date() : false;
  };

  // Format date for input
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  };

  // Parse date from input
  const parseDateFromInput = (dateString: string): Date | undefined => {
    return dateString ? new Date(dateString) : undefined;
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: theme.colors.text,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.75rem',
    color: theme.colors.textSecondary
  };

  const statItemStyle: React.CSSProperties = {
    padding: '0.25rem 0.5rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '4px',
    border: `1px solid ${theme.colors.border}`
  };

  const offerCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '1.5rem',
    backgroundColor: theme.colors.surface,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    position: 'relative'
  };

  const expiredOfferStyle: React.CSSProperties = {
    ...offerCardStyle,
    opacity: 0.6,
    borderColor: theme.colors.error,
    backgroundColor: `${theme.colors.error}05`
  };

  const offerHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const offerNumberStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem'
  };

  const actionButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  };

  // ✅ Fixed: Updated price display styles for new structure
  const priceDisplayStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    marginBottom: '1rem',
    flexWrap: 'wrap'
  };

  const originalPriceStyle: React.CSSProperties = {
    textDecoration: 'line-through',
    color: theme.colors.textMuted,
    fontWeight: '500'
  };

  const offerPriceStyle: React.CSSProperties = {
    fontWeight: '600',
    color: theme.colors.success,
    fontSize: '1rem'
  };

  const savingsStyle: React.CSSProperties = {
    backgroundColor: theme.colors.success,
    color: theme.colors.textOnPrimary,
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600'
  };

  const addOfferSectionStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`
  };

  const addButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem'
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...addButtonStyle,
    backgroundColor: theme.colors.disabled,
    color: theme.colors.textMuted,
    cursor: 'not-allowed',
    opacity: 0.6
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '3rem 2rem',
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '12px',
    border: `2px dashed ${theme.colors.border}`
  };

  const infoBoxStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: `${theme.colors.info}10`,
    border: `1px solid ${theme.colors.info}30`,
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    marginBottom: '1rem'
  };

  // ✅ Fixed: Updated validation logic
  const isAddDisabled = !newOffer.title?.trim() || (
    !newOffer.originalPrice && !newOffer.discountedPrice
  ) || (
    newOffer.originalPrice && newOffer.discountedPrice && 
    newOffer.discountedPrice >= newOffer.originalPrice
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>Special Offers & Promotions</span>
        {offerStats.total > 0 && (
          <div style={statsStyle}>
            <span style={statItemStyle}>Total: {offerStats.total}</span>
            <span style={statItemStyle}>Active: {offerStats.active}</span>
            <span style={statItemStyle}>Avg Savings: {offerStats.avgSavings}%</span>
          </div>
        )}
      </div>

      <div style={infoBoxStyle}>
        <FiInfo size={16} color={theme.colors.info} />
        <div>
          <strong>How offers work with order inquiries:</strong>
          <br />
          When customers create order inquiries, they can either select one of these offers OR specify a quantity. 
          You can set specific original and discounted prices for each offer, or let the system use your product's base price.
        </div>
      </div>
      
      {/* Existing Offers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(formData.offers || []).length === 0 ? (
          <div style={emptyStateStyle}>
            <FiPercent size={32} color={theme.colors.textMuted} style={{ marginBottom: '1rem' }} />
            <h4 style={{ margin: '0 0 0.5rem 0', color: theme.colors.text }}>No offers yet</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Create special offers and promotions for your customers.<br />
              These will be available as options when customers make order inquiries.
            </p>
          </div>
        ) : (
          (formData.offers || []).map((offer, index) => {
            const expired = isOfferExpired(offer);
            const finalPrice = getOfferFinalPrice(offer);
            const savings = getOfferSavings(offer);
            const hasCustomPricing = offer.originalPrice || offer.discountedPrice;
            
            return (
              <div key={index} style={expired ? expiredOfferStyle : offerCardStyle}>
                <div style={offerHeaderStyle}>
                  <div style={offerNumberStyle}>
                    <FiPercent size={16} />
                    <span>Offer {index + 1}</span>
                    {expired && (
                      <span style={{ 
                        color: theme.colors.error, 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        EXPIRED
                      </span>
                    )}
                  </div>
                  <div style={actionsStyle}>
                    <button
                      type="button"
                      onClick={() => duplicateOffer(index)}
                      style={{
                        ...actionButtonStyle,
                        color: theme.colors.textSecondary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.colors.primary}15`;
                        e.currentTarget.style.color = theme.colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = theme.colors.textSecondary;
                      }}
                      title="Duplicate offer"
                    >
                      <FiPlus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateOffer(index, 'isActive', !offer.isActive)}
                      style={{
                        ...actionButtonStyle,
                        color: offer.isActive ? theme.colors.success : theme.colors.textMuted
                      }}
                      title={offer.isActive ? 'Hide offer' : 'Show offer'}
                    >
                      {offer.isActive ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOffer(index)}
                      style={{
                        ...actionButtonStyle,
                        color: theme.colors.error
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Remove offer"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={gridStyle}>
                  <ValidatedInput
                    label="Offer Title"
                    fieldName={`offers.${index}.title`}
                    errors={validationErrors}
                    required
                    type="text"
                    value={offer.title}
                    onChange={(e) => updateOffer(index, 'title', e.target.value)}
                    placeholder="e.g., Black Friday Sale"
                    description={`${PRODUCT_LIMITS.OFFER_TITLE_MIN_LENGTH}-${PRODUCT_LIMITS.OFFER_TITLE_MAX_LENGTH} characters`}
                  />
                  
                  {/* ✅ Fixed: Original Price field */}
                  <ValidatedInput
                    label="Original Price (Optional)"
                    fieldName={`offers.${index}.originalPrice`}
                    errors={validationErrors}
                    type="number"
                    min="0"
                    step="0.01"
                    value={offer.originalPrice || ''}
                    onChange={(e) => updateOffer(index, 'originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder={`Default: $${formData.price || 0}`}
                    description="Leave empty to use product's base price"
                  />
                  
                  {/* ✅ Fixed: Discounted Price field */}
                  <ValidatedInput
                    label="Discounted Price (Optional)"
                    fieldName={`offers.${index}.discountedPrice`}
                    errors={validationErrors}
                    type="number"
                    min="0"
                    step="0.01"
                    value={offer.discountedPrice || ''}
                    onChange={(e) => updateOffer(index, 'discountedPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Final price customer pays"
                    description="Must be less than original price"
                  />
                  
                  <ValidatedInput
                    label="Valid Until (Optional)"
                    fieldName={`offers.${index}.validUntil`}
                    errors={validationErrors}
                    type="datetime-local"
                    value={formatDateForInput(offer.validUntil)}
                    onChange={(e) => updateOffer(index, 'validUntil', parseDateFromInput(e.target.value))}
                  />
                </div>

                {/* ✅ Fixed: Price Display with new structure */}
                {(hasCustomPricing || formData.price) && (
                  <div style={priceDisplayStyle}>
                    <span>Customer pays:</span>
                    {savings.amount > 0 && (
                      <>
                        <span style={originalPriceStyle}>
                          ${(offer.originalPrice || formData.price || 0).toFixed(2)}
                        </span>
                        <span>→</span>
                      </>
                    )}
                    <span style={offerPriceStyle}>
                      ${finalPrice.toFixed(2)}
                    </span>
                    {savings.amount > 0 && (
                      <span style={savingsStyle}>
                        Save ${savings.amount.toFixed(2)} ({savings.percentage}% off)
                      </span>
                    )}
                  </div>
                )}

                <ValidatedTextarea
                  label="Offer Description (Optional)"
                  fieldName={`offers.${index}.description`}
                  errors={validationErrors}
                  value={offer.description || ''}
                  onChange={(e) => updateOffer(index, 'description', e.target.value)}
                  placeholder="Describe this offer to customers..."
                  rows={2}
                  description={`Max ${PRODUCT_LIMITS.OFFER_DESCRIPTION_MAX_LENGTH} characters`}
                />

                <ValidatedCheckbox
                  label="Active Offer"
                  fieldName={`offers.${index}.isActive`}
                  description="Customers can select this offer when creating order inquiries"
                  errors={validationErrors}
                  checked={offer.isActive !== false}
                  onChange={(e) => updateOffer(index, 'isActive', e.target.checked)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Fixed: Add New Offer Section with new pricing structure */}
      <div style={addOfferSectionStyle}>
        <h4 style={{ margin: '0 0 1rem 0', color: theme.colors.text }}>Create New Offer</h4>
        
        <div style={gridStyle}>
          <ValidatedInput
            label="Offer Title"
            fieldName="newOffer.title"
            errors={validationErrors}
            required
            type="text"
            value={newOffer.title || ''}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            placeholder="e.g., Holiday Special"
            description={`${PRODUCT_LIMITS.OFFER_TITLE_MIN_LENGTH}-${PRODUCT_LIMITS.OFFER_TITLE_MAX_LENGTH} characters`}
          />
          
          <ValidatedInput
            label="Original Price (Optional)"
            fieldName="newOffer.originalPrice"
            errors={validationErrors}
            type="number"
            min="0"
            step="0.01"
            value={newOffer.originalPrice || ''}
            onChange={(e) => setNewOffer({ ...newOffer, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder={`Default: $${formData.price || 0}`}
            description="Leave empty to use product's base price"
          />
          
          <ValidatedInput
            label="Discounted Price (Optional)"
            fieldName="newOffer.discountedPrice"
            errors={validationErrors}
            type="number"
            min="0"
            step="0.01"
            value={newOffer.discountedPrice || ''}
            onChange={(e) => setNewOffer({ ...newOffer, discountedPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="Final price customer pays"
            description="Must be less than original price"
          />
          
          <ValidatedInput
            label="Valid Until (Optional)"
            fieldName="newOffer.validUntil"
            errors={validationErrors}
            type="datetime-local"
            value={formatDateForInput(newOffer.validUntil)}
            onChange={(e) => setNewOffer({ ...newOffer, validUntil: parseDateFromInput(e.target.value) })}
          />
        </div>

        {/* ✅ Fixed: New Offer Price Preview */}
        {(newOffer.originalPrice || newOffer.discountedPrice || formData.price) && (
          <div style={priceDisplayStyle}>
            <span>Preview price:</span>
            {(() => {
              const previewOriginal = newOffer.originalPrice || formData.price || 0;
              const previewFinal = newOffer.discountedPrice || OrderInquiryUtils.getEffectivePrice({
                price: formData.price,
                discountPrice: formData.discountPrice
              } as IProduct);
              const previewSavings = Math.max(0, previewOriginal - previewFinal);
              const previewPercentage = previewOriginal > 0 ? Math.round((previewSavings / previewOriginal) * 100) : 0;
              
              return (
                <>
                  {previewSavings > 0 && (
                    <>
                      <span style={originalPriceStyle}>${previewOriginal.toFixed(2)}</span>
                      <span>→</span>
                    </>
                  )}
                  <span style={offerPriceStyle}>${previewFinal.toFixed(2)}</span>
                  {previewSavings > 0 && (
                    <span style={savingsStyle}>
                      Save ${previewSavings.toFixed(2)} ({previewPercentage}% off)
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        )}

        <ValidatedTextarea
          label="Offer Description (Optional)"
          fieldName="newOffer.description"
          errors={validationErrors}
          value={newOffer.description || ''}
          onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
          placeholder="Describe this offer to customers..."
          rows={2}
          description={`Max ${PRODUCT_LIMITS.OFFER_DESCRIPTION_MAX_LENGTH} characters`}
        />

        <button
          type="button"
          onClick={addOffer}
          disabled={isAddDisabled}
          style={isAddDisabled ? disabledButtonStyle : addButtonStyle}
          onMouseEnter={(e) => {
            if (!isAddDisabled) {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            }
          }}
          onMouseLeave={(e) => {
            if (!isAddDisabled) {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }
          }}
        >
          <FiPlus size={16} />
          Add Offer
        </button>
      </div>
    </div>
  );
};

export default OffersTab;