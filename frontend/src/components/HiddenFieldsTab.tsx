import React, { useMemo, useState } from 'react';
import { FiTrash2, FiPlus, FiEyeOff } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IHiddenField } from '../types/product';
import { ValidatedInput } from './ValidationErrorDisplay';
import type { ValidationError } from '../utils/validation';
interface HiddenFieldsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors?: ValidationError[]; 
}

const HiddenFieldsTab: React.FC<HiddenFieldsTabProps> = ({
  formData,
  setFormData,
  validationErrors
}) => {
  const { theme } = useTheme();
  const [newHiddenField, setNewHiddenField] = useState<Partial<IHiddenField>>({
    key: '',
    value: '',
    description: ''
  });

  // Normalize different error shapes into Record<string, string[]>
  const buildErrorMap = (errs: any): Record<string, string[]> => {
    const map: Record<string, string[]> = {};
    if (!errs) return map;

    // If it's already a map of string -> string[]
    if (typeof errs === 'object' && !Array.isArray(errs)) {
      const keys = Object.keys(errs);
      const allArraysOfStrings = keys.length > 0 && keys.every(k =>
        Array.isArray((errs as any)[k]) && (errs as any)[k].every((v: any) => typeof v === 'string')
      );
      if (allArraysOfStrings) {
        return errs as Record<string, string[]>;
      }
      // Look for keys like 'hidden' that contain arrays of { field, message }
      for (const k of keys) {
        const val = (errs as any)[k];
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && 'field' in val[0]) {
          val.forEach((e: any) => {
            if (!e.field) return;
            map[e.field] = map[e.field] || [];
            if (e.message) map[e.field].push(e.message);
          });
          return map;
        }
      }
    }

    // If it's a plain array of { field, message }
    if (Array.isArray(errs)) {
      errs.forEach((e: any) => {
        if (!e || !e.field) return;
        map[e.field] = map[e.field] || [];
        if (e.message) map[e.field].push(e.message);
      });
      return map;
    }

    return map;
  };

  const normalizedErrors = useMemo(() => buildErrorMap(validationErrors), [validationErrors]);



  const addHiddenField = () => {
    if (!newHiddenField.key?.trim()) return;

    setFormData(prev => ({
      ...prev,
      hiddenFields: [...(prev.hiddenFields || []), {
        key: newHiddenField.key || '',
        value: newHiddenField.value || '',
        description: newHiddenField.description || ''
      } as IHiddenField]
    }));
    setNewHiddenField({ key: '', value: '', description: '' });
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

  // Theme-based styles (kept your original styles)
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

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    margin: 0,
    lineHeight: '1.5'
  };

  const fieldCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '1.5rem',
    backgroundColor: theme.colors.surface,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`
  };

  const fieldHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const fieldNumberStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const removeButtonStyle: React.CSSProperties = {
    color: theme.colors.error,
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  };

  const fullWidthInputStyle: React.CSSProperties = {
    gridColumn: '1 / -1'
  };

  const addSectionStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const addHeaderStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '500',
    color: theme.colors.text,
    margin: 0
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
    padding: '2rem',
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '12px',
    border: `2px dashed ${theme.colors.border}`
  };

  const isAddDisabled = !newHiddenField.key?.trim();

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={headerStyle}>Hidden Tracking Fields</h3>
        <p style={descriptionStyle}>
          These fields will be stored with submissions but not shown to customers.
          Useful for tracking UTM parameters, source references, etc.
        </p>
      </div>

      {/* Existing Hidden Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
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
                  errors={normalizedErrors}
                  required
                  type="text"
                  value={field.key}
                  onChange={(e) => updateHiddenField(index, 'key', e.target.value)}
                  placeholder="e.g., utm_source"
                />

                <ValidatedInput
                  label="Default Value"
                  fieldName={`hiddenFields.${index}.value`}
                  errors={normalizedErrors}
                  type="text"
                  value={field.value || ''}
                  onChange={(e) => updateHiddenField(index, 'value', e.target.value)}
                  placeholder="Default value (required )"
                />

                <div style={fullWidthInputStyle}>
                  <ValidatedInput
                    label="Description"
                    fieldName={`hiddenFields.${index}.description`}
                    errors={normalizedErrors}
                    type="text"
                    value={field.description || ''}
                    onChange={(e) => updateHiddenField(index, 'description', e.target.value)}
                    placeholder="Description of what this field tracks (required )"
                  />
                </div>
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
            errors={normalizedErrors}
            required
            type="text"
            value={newHiddenField.key || ''}
            onChange={(e) => setNewHiddenField({ ...newHiddenField, key: e.target.value })}
            placeholder="e.g., utm_source, campaign_id"
          />

          <ValidatedInput
            label="Default Value"
            fieldName="newHiddenField.value"
            errors={normalizedErrors}
            type="text"
            value={newHiddenField.value || ''}
            onChange={(e) => setNewHiddenField({ ...newHiddenField, value: e.target.value })}
            placeholder="Default value (optional)"
          />

          <div style={fullWidthInputStyle}>
            <ValidatedInput
              label="Description"
              fieldName="newHiddenField.description"
              errors={normalizedErrors}
              type="text"
              value={newHiddenField.description || ''}
              onChange={(e) => setNewHiddenField({ ...newHiddenField, description: e.target.value })}
              placeholder="Description of what this field tracks (optional)"
            />
          </div>
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
    </div>
  );
};

export default HiddenFieldsTab;
