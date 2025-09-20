import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiPercent } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IOffer } from '../types/product';
import { ValidatedInput, ValidatedTextarea, ValidatedCheckbox } from './ValidationErrorDisplay';

interface OffersTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const OffersTab: React.FC<OffersTabProps> = ({ formData, setFormData, validationErrors }) => {
  const { theme } = useTheme();
  const [newOffer, setNewOffer] = useState<Partial<IOffer>>({
    title: '',
    description: '',
    discount: 0,
    isActive: true
  });

  const addOffer = () => {
    if (!newOffer.title?.trim() || !newOffer.discount) return;
    
    setFormData(prev => ({
      ...prev,
      offers: [...(prev.offers || []), { ...newOffer } as IOffer]
    }));
    setNewOffer({
      title: '',
      description: '',
      discount: 0,
      isActive: true
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

  // Theme-based styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    margin: 0,
    marginBottom: theme.spacing.md
  };

  const offerCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm
  };

  const offerHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  };

  const offerNumberStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  const removeButtonStyle: React.CSSProperties = {
    color: '#ef4444',
    backgroundColor: 'transparent',
    border: 'none',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  };

  const addOfferSectionStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  };

  const addOfferHeaderStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    margin: 0
  };

  const addButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    border: 'none',
    borderRadius: theme.borderRadius.lg,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...addButtonStyle,
    backgroundColor: theme.colors.textMuted,
    cursor: 'not-allowed',
    opacity: 0.6
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    border: `2px dashed ${theme.colors.border}`
  };

  const checkboxRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md
  };

  const isAddDisabled = !newOffer.title?.trim() || !newOffer.discount;

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>Special Offers</h3>
      
      {/* Existing Offers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        {(formData.offers || []).length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontStyle: 'italic' }}>
              No offers added yet. Create your first offer below.
            </p>
          </div>
        ) : (
          (formData.offers || []).map((offer, index) => (
            <div key={index} style={offerCardStyle}>
              <div style={offerHeaderStyle}>
                <div style={offerNumberStyle}>
                  <FiPercent size={16} />
                  <span>Offer {index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeOffer(index)}
                  style={removeButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Remove offer"
                >
                  <FiTrash2 size={16} />
                </button>
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
                />
                <ValidatedInput
                  label="Discount (%)"
                  fieldName={`offers.${index}.discount`}
                  errors={validationErrors}
                  required
                  type="number"
                  min="1"
                  max="99"
                  value={offer.discount}
                  onChange={(e) => updateOffer(index, 'discount', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 20"
                />
              </div>

              <ValidatedTextarea
                label="Offer Description"
                fieldName={`offers.${index}.description`}
                errors={validationErrors}
                value={offer.description || ''}
                onChange={(e) => updateOffer(index, 'description', e.target.value)}
                placeholder="Describe this offer (optional)..."
                rows={2}
              />

              <div style={checkboxRowStyle}>
                <ValidatedCheckbox
                  label="Active Offer"
                  fieldName={`offers.${index}.isActive`}
                  description="This offer will be visible to customers"
                  errors={validationErrors}
                  checked={offer.isActive !== false}
                  onChange={(e) => updateOffer(index, 'isActive', e.target.checked)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Offer Section */}
      <div style={addOfferSectionStyle}>
        <h4 style={addOfferHeaderStyle}>Add New Offer</h4>
        
        <div style={gridStyle}>
          <ValidatedInput
            label="Offer Title"
            fieldName="newOffer.title"
            errors={validationErrors}
            required
            type="text"
            value={newOffer.title || ''}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            placeholder="e.g., Black Friday Sale"
          />
          <ValidatedInput
            label="Discount (%)"
            fieldName="newOffer.discount"
            errors={validationErrors}
            required
            type="number"
            min="1"
            max="99"
            value={newOffer.discount || ''}
            onChange={(e) => setNewOffer({ ...newOffer, discount: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 20"
          />
        </div>

        <ValidatedTextarea
          label="Offer Description (Optional)"
          fieldName="newOffer.description"
          errors={validationErrors}
          value={newOffer.description || ''}
          onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
          placeholder="Describe this offer..."
          rows={2}
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