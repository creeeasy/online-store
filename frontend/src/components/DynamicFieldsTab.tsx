 import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IDynamicField } from '../types/product';
import { ValidatedInput } from './ValidationErrorDisplay';

interface DynamicFieldsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const DynamicFieldsTab: React.FC<DynamicFieldsTabProps> = ({ formData, setFormData, validationErrors }) => {
  const { theme } = useTheme();
  const [newField, setNewField] = useState<Omit<IDynamicField, '_id'>>({ key: '', placeholder: '' });

  const addDynamicField = () => {
    setFormData(prev => ({
      ...prev,
      dynamicFields: [...(prev.dynamicFields || []), { ...newField } as IDynamicField]
    }));
    setNewField({ key: '', placeholder: '' });
  };

  const updateDynamicField = (index: number, field: 'key' | 'placeholder', value: string) => {
    const newFields = [...(formData.dynamicFields || [])];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData(prev => ({ ...prev, dynamicFields: newFields }));
  };

  const removeDynamicField = (index: number) => {
    const newFields = (formData.dynamicFields || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, dynamicFields: newFields }));
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

  const fieldCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm,
    gap: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column'
  };

  const fieldHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.textSecondary,
    margin: 0
  };

  const deleteButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  const fieldsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.md
  };

  const addFieldSectionStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    gap: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column'
  };

  const addFieldHeaderStyle: React.CSSProperties = {
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    margin: 0,
    fontSize: '1rem'
  };

  const addButtonStyle = (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: disabled ? theme.colors.textMuted : theme.colors.primary,
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: disabled ? 'none' : theme.shadows.sm
  });

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    border: `2px dashed ${theme.colors.border}`
  };

  const emptyStateTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    margin: 0,
    fontStyle: 'italic'
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>Custom Form Fields</h3>

      {/* Existing Dynamic Fields */}
      {formData.dynamicFields && formData.dynamicFields.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {formData.dynamicFields.map((field, index) => (
            <div key={index} style={fieldCardStyle}>
              <div style={fieldHeaderStyle}>
                <span style={fieldLabelStyle}>Dynamic Field {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeDynamicField(index)}
                  style={deleteButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    e.currentTarget.style.color = theme.colors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.primary;
                  }}
                  aria-label={`Remove dynamic field ${index + 1}`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div style={fieldsGridStyle}>
                <ValidatedInput
                  label="Field Key"
                  fieldName={`dynamicFields.${index}.key`}
                  errors={validationErrors}
                  required
                  type="text"
                  value={field.key}
                  onChange={(e) => updateDynamicField(index, 'key', e.target.value)}
                  placeholder="e.g., size, color"
                />

                <ValidatedInput
                  label="Placeholder Text"
                  fieldName={`dynamicFields.${index}.placeholder`}
                  errors={validationErrors}
                  required
                  type="text"
                  value={field.placeholder}
                  onChange={(e) => updateDynamicField(index, 'placeholder', e.target.value)}
                  placeholder="e.g., Enter size"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <p style={emptyStateTextStyle}>
            No custom fields added yet. Add fields below to create dynamic form inputs.
          </p>
        </div>
      )}

      {/* Add New Field Section */}
      <div style={addFieldSectionStyle}>
        <h4 style={addFieldHeaderStyle}>Add Custom Field</h4>
        <div style={fieldsGridStyle}>
          <ValidatedInput
            label="Field Key"
            fieldName="newField.key"
            errors={validationErrors}
            required
            type="text"
            value={newField.key}
            onChange={(e) => setNewField({ ...newField, key: e.target.value })}
            placeholder="e.g., size, color"
          />

          <ValidatedInput
            label="Placeholder Text"
            fieldName="newField.placeholder"
            errors={validationErrors}
            required
            type="text"
            value={newField.placeholder}
            onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
            placeholder="e.g., Enter size"
          />
        </div>
        <button
          type="button"
          onClick={addDynamicField}
          disabled={!newField.key?.trim() || !newField.placeholder?.trim()}
          style={addButtonStyle(!newField.key?.trim() || !newField.placeholder?.trim())}
          onMouseEnter={(e) => {
            if (!(!newField.key?.trim() || !newField.placeholder?.trim())) {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }
          }}
          onMouseLeave={(e) => {
            if (!(!newField.key?.trim() || !newField.placeholder?.trim())) {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }
          }}
        >
          Add Field
        </button>
      </div>
    </div>
  );
};

export default DynamicFieldsTab;