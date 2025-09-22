import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { PredefinedFieldGroup } from '../types/types';

interface PredefinedFieldsProps {
  fields: PredefinedFieldGroup[];
}

const PredefinedFields: React.FC<PredefinedFieldsProps> = ({ fields }) => {
  const { theme } = useTheme();
  const [customFields, setCustomFields] = useState<Array<{key: string; value: string}>>([]);

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const updateCustomField = (index: number, field: 'key' | 'value', newValue: string) => {
    const updatedFields = [...customFields];
    updatedFields[index][field] = newValue;
    setCustomFields(updatedFields);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  if (!fields || fields.length === 0) {
    return null;
  }

  // Enhanced styles using theme
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.fonts.family.heading,
    letterSpacing: theme.fonts.letterSpacing.tight,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    background: theme.colors.gradientPrimary,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing['2xl'],
  };

  const fieldGroupStyle: React.CSSProperties = {
    borderBottom: `1px solid ${theme.colors.border}`,
    paddingBottom: theme.spacing.lg,
  };

  const lastFieldGroupStyle: React.CSSProperties = {
    ...fieldGroupStyle,
    borderBottom: 'none',
    paddingBottom: 0,
  };

  const categoryTitleStyle: React.CSSProperties = {
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'capitalize',
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.heading,
    letterSpacing: theme.fonts.letterSpacing.wide,
  };

  const optionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  };

  const optionTagStyle: React.CSSProperties = {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    border: `1px solid ${theme.colors.border}`,
    transition: theme.transitions.fast,
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: theme.shadows.xs,
  };

  const customSectionStyle: React.CSSProperties = {
    marginTop: theme.spacing.lg,
  };

  const customFieldRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    transition: theme.transitions.fast,
    outline: 'none',
  };

  const removeButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: `${theme.colors.error}15`,
    color: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.error}30`,
    cursor: 'pointer',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    transition: theme.transitions.fast,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    whiteSpace: 'nowrap',
  };

  const addButtonStyle: React.CSSProperties = {
    marginTop: theme.spacing.md,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    transition: theme.transitions.fast,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.textMuted,
    fontSize: theme.fonts.size.md,
    fontStyle: 'italic',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={iconStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        Product Specifications
      </div>
      
      <div style={contentStyle}>
        {fields.filter(fieldGroup => fieldGroup.isActive).length === 0 ? (
          <div style={emptyStateStyle}>
            No specifications configured for this product
          </div>
        ) : (
          fields.map((fieldGroup, index) => (
            fieldGroup.isActive && (
              <div 
                key={index} 
                style={index === fields.filter(fg => fg.isActive).length - 1 ? lastFieldGroupStyle : fieldGroupStyle}
              >
                <h4 style={categoryTitleStyle}>{fieldGroup.category}</h4>
                <div style={optionsContainerStyle}>
                  {fieldGroup.selectedOptions.length === 0 ? (
                    <span style={{ ...optionTagStyle, color: theme.colors.textMuted, fontStyle: 'italic' }}>
                      No options selected
                    </span>
                  ) : (
                    fieldGroup.selectedOptions.map((option, optIndex) => (
                      <span 
                        key={optIndex}
                        style={optionTagStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.primary + '15';
                          e.currentTarget.style.borderColor = theme.colors.primary + '50';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = theme.shadows.sm;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                          e.currentTarget.style.borderColor = theme.colors.border;
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = theme.shadows.xs;
                        }}
                      >
                        {option}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )
          ))
        )}
        
        {/* Custom fields section */}
        <div style={customSectionStyle}>
          <h4 style={categoryTitleStyle}>Additional Information</h4>
          
          {customFields.length === 0 && (
            <div style={emptyStateStyle}>
              No additional fields added
            </div>
          )}
          
          {customFields.map((field, index) => (
            <div key={index} style={customFieldRowStyle}>
              <input
                type="text"
                placeholder="Field name"
                value={field.key}
                onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <input
                type="text"
                placeholder="Field value"
                value={field.value}
                onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={() => removeCustomField(index)}
                style={removeButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.error;
                  e.currentTarget.style.color = theme.colors.white;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = theme.shadows.sm;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
                  e.currentTarget.style.color = theme.colors.error;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title="Remove field"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6V20a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6M8,6V4a2,2 0,0,1,2-2h4a2,2 0,0,1,2,2V6"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                Remove
              </button>
            </div>
          ))}
          
          <button
            onClick={addCustomField}
            style={addButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.color = theme.colors.white;
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
              e.currentTarget.style.color = theme.colors.text;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Custom Field
          </button>
        </div>
      </div>
      
      {/* Hidden inputs for backend processing */}
      {fields.map((fieldGroup, index) => (
        <input
          key={index}
          type="hidden"
          name={`predefined_${fieldGroup.category}`}
          value={fieldGroup.selectedOptions.join(',')}
        />
      ))}
      {customFields.map((field, index) => (
        <React.Fragment key={index}>
          <input type="hidden" name={`custom_${field.key}_key`} value={field.key} />
          <input type="hidden" name={`custom_${field.key}_value`} value={field.value} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default PredefinedFields;