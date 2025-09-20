import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiEyeOff } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IHiddenField } from '../types/product';
import { ValidatedInput } from './ValidationErrorDisplay';

interface HiddenFieldsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const HiddenFieldsTab: React.FC<HiddenFieldsTabProps> = ({ 
  formData, 
  setFormData, 
  validationErrors 
}) => {
  const { theme } = useTheme();
  const [newHiddenField, setNewHiddenField] = useState<Partial<IHiddenField>>({ 
    key: '', 
    value: '' 
  });

  const addHiddenField = () => {
    if (!newHiddenField.key?.trim()) return;

    setFormData(prev => ({
      ...prev,
      hiddenFields: [...(prev.hiddenFields || []), { ...newHiddenField } as IHiddenField]
    }));
    setNewHiddenField({ key: '', value: '' });
  };

  const updateHiddenField = (index: number, field: string, value: string) => {
    const newFields = [...(formData.hiddenFields || [])];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData(prev => ({ ...prev, hiddenFields: newFields }));
  };

  const removeHiddenField = (index: number) => {
    const newHiddenFields = (formData.hiddenFields || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, hiddenFields: newHiddenFields }));
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
    margin: 0
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    margin: 0,
    lineHeight: '1.5'
  };

  const fieldCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm
  };

  const fieldHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  };

  const fieldNumberStyle: React.CSSProperties = {
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md
  };

  const addSectionStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  };

  const addHeaderStyle: React.CSSProperties = {
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

  const isAddDisabled = !newHiddenField.key?.trim();

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: theme.spacing.md }}>
        <h3 style={headerStyle}>Hidden Tracking Fields</h3>
        <p style={descriptionStyle}>
          These fields will be stored with submissions but not shown to customers.
          Useful for tracking UTM parameters, source references, etc.
        </p>
      </div>

      {/* Existing Hidden Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        {(formData.hiddenFields || []).length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontStyle: 'italic' }}>
              No hidden fields configured. Add tracking fields below.
            </p>
          </div>
        ) : (
          (formData.hiddenFields || []).map((field, index) => (
            <div key={index} style={fieldCardStyle}>
              <div style={fieldHeaderStyle}>
                <div style={fieldNumberStyle}>
                  <FiEyeOff size={16} />
                  <span>Hidden Field {index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeHiddenField(index)}
                  style={removeButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Remove hidden field"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div style={gridStyle}>
                <ValidatedInput
                  label="Field Key"
                  fieldName={`hiddenFields.${index}.key`}
                  errors={validationErrors}
                  required
                  type="text"
                  value={field.key}
                  onChange={(e) => updateHiddenField(index, 'key', e.target.value)}
                  placeholder="e.g., utm_source"
                />

                <ValidatedInput
                  label="Default Value"
                  fieldName={`hiddenFields.${index}.value`}
                  errors={validationErrors}
                  type="text"
                  value={field.value || ''}
                  onChange={(e) => updateHiddenField(index, 'value', e.target.value)}
                  placeholder="Default value (optional)"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Hidden Field */}
      <div style={addSectionStyle}>
        <h4 style={addHeaderStyle}>Add Hidden Field</h4>
        
        <div style={gridStyle}>
          <ValidatedInput
            label="Field Key"
            fieldName="newHiddenField.key"
            errors={validationErrors}
            required
            type="text"
            value={newHiddenField.key || ''}
            onChange={(e) => setNewHiddenField({ ...newHiddenField, key: e.target.value })}
            placeholder="e.g., utm_source, campaign_id"
          />

          <ValidatedInput
            label="Default Value"
            fieldName="newHiddenField.value"
            errors={validationErrors}
            type="text"
            value={newHiddenField.value || ''}
            onChange={(e) => setNewHiddenField({ ...newHiddenField, value: e.target.value })}
            placeholder="Default value (optional)"
          />
        </div>

        <button
          type="button"
          onClick={addHiddenField}
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
          Add Hidden Field
        </button>
      </div>

      {/* Common Use Cases Help */}
      <div style={{
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        borderLeft: `4px solid ${theme.colors.primary}`
      }}>
        <h5 style={{
          fontSize: '0.875rem',
          fontWeight: theme.fonts.semiBold,
          color: theme.colors.text,
          margin: 0,
          marginBottom: theme.spacing.xs
        }}>
          Common Hidden Fields:
        </h5>
        <p style={{
          fontSize: '0.75rem',
          color: theme.colors.textSecondary,
          margin: 0,
          lineHeight: '1.4'
        }}>
          utm_source, utm_medium, utm_campaign, referrer, landing_page, device_type, user_agent
        </p>
      </div>
    </div>
  );
};

export default HiddenFieldsTab;