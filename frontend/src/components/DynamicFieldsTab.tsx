import React, { useState, useEffect } from 'react';
import { FiTrash2, FiLock } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IDynamicField } from '../types/product';
import { ValidatedInput } from './ValidationErrorDisplay';

interface DynamicFieldsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

// Default dynamic fields that should always be present
const DEFAULT_DYNAMIC_FIELDS: Omit<IDynamicField, '_id'>[] = [
  {
    key: 'fullName',
    placeholder: 'Enter your full name',
    isRequired: true,
    isDefault: true
  },
  {
    key: 'phoneNumber',
    placeholder: 'Enter your phone number (e.g., 0555123456)',
    isRequired: true,
    isDefault: true
  },
  {
    key: 'wilaya',
    placeholder: 'Select your wilaya',
    isRequired: true,
    isDefault: true
  }
];

const DynamicFieldsTab: React.FC<DynamicFieldsTabProps> = ({ formData, setFormData, validationErrors }) => {
  const { theme } = useTheme();
  const [newField, setNewField] = useState<Omit<IDynamicField, '_id'>>({ 
    key: '', 
    placeholder: '',
    isRequired: false,
    isDefault: false
  });

  // Initialize default fields if they don't exist
  useEffect(() => {
    if (!formData.dynamicFields || formData.dynamicFields.length === 0) {
      setFormData(prev => ({
        ...prev,
        dynamicFields: DEFAULT_DYNAMIC_FIELDS.map(field => ({ ...field } as IDynamicField))
      }));
    } else {
      // Check if default fields are missing and add them
      const existingKeys = formData.dynamicFields.map(field => field.key);
      const missingDefaultFields = DEFAULT_DYNAMIC_FIELDS.filter(
        defaultField => !existingKeys.includes(defaultField.key)
      );
      
      if (missingDefaultFields.length > 0) {
        setFormData(prev => ({
          ...prev,
          dynamicFields: [
            ...missingDefaultFields.map(field => ({ ...field } as IDynamicField)),
            ...(prev.dynamicFields || [])
          ]
        }));
      }
    }
  }, [formData.dynamicFields, setFormData]);

  const addDynamicField = () => {
    if (!newField.key?.trim() || !newField.placeholder?.trim()) return;
    
    // Check if field key already exists
    const existingKeys = formData.dynamicFields?.map(field => field.key) || [];
    if (existingKeys.includes(newField.key.trim())) {
      alert('A field with this key already exists. Please use a different key.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      dynamicFields: [...(prev.dynamicFields || []), { 
        ...newField,
        key: newField.key.trim(),
        placeholder: newField.placeholder.trim(),
        isDefault: false
      } as IDynamicField]
    }));
    setNewField({ key: '', placeholder: '', isRequired: false, isDefault: false });
  };

  const updateDynamicField = (index: number, field: keyof IDynamicField, value: string | boolean) => {
    const newFields = [...(formData.dynamicFields || [])];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData(prev => ({ ...prev, dynamicFields: newFields }));
  };

  const removeDynamicField = (index: number) => {
    const fieldToRemove = formData.dynamicFields?.[index];
    
    // Prevent removal of default fields
    if (fieldToRemove?.isDefault) {
      alert('Default fields cannot be removed.');
      return;
    }

    const newFields = (formData.dynamicFields || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, dynamicFields: newFields }));
  };

  const resetToDefaults = () => {
    if (window.confirm('This will remove all custom fields and reset to default fields. Are you sure?')) {
      setFormData(prev => ({
        ...prev,
        dynamicFields: DEFAULT_DYNAMIC_FIELDS.map(field => ({ ...field } as IDynamicField))
      }));
    }
  };

  // Helper function to get field label
  const getFieldLabel = (field: IDynamicField, index: number) => {
    if (field.isDefault) {
      switch (field.key) {
        case 'fullName':
          return '👤 Full Name (Default)';
        case 'phoneNumber':
          return '📱 Phone Number (Default)';
        case 'wilaya':
          return '📍 Wilaya (Default)';
        default:
          return `Default Field ${index + 1}`;
      }
    }
    return `Custom Field ${index + 1}`;
  };

  // Theme-based styles using your theme structure
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
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const resetButtonStyle: React.CSSProperties = {
    background: 'none',
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const fieldCardStyle = (isDefault: boolean): React.CSSProperties => ({
    border: `1px solid ${isDefault ? `${theme.colors.primary}40` : theme.colors.border}`,
    borderRadius: '12px',
    padding: '1.5rem',
    backgroundColor: isDefault ? `${theme.colors.primary}08` : theme.colors.surface,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    gap: '1rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  });

  const fieldHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const fieldLabelStyle = (isDefault: boolean): React.CSSProperties => ({
    fontSize: '0.875rem',
    fontWeight: isDefault ? '600' : '500',
    color: isDefault ? theme.colors.primary : theme.colors.textSecondary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  const deleteButtonStyle = (isDefault: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    color: isDefault ? theme.colors.textMuted : theme.colors.error,
    cursor: isDefault ? 'not-allowed' : 'pointer',
    padding: '0.75rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    opacity: isDefault ? 0.5 : 1
  });

  const fieldsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.75rem'
  };

  const checkboxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: theme.colors.primary
  };

  const checkboxLabelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    margin: 0
  };

  const addFieldSectionStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    gap: '1rem',
    display: 'flex',
    flexDirection: 'column'
  };

  const addFieldHeaderStyle: React.CSSProperties = {
    fontWeight: '500',
    color: theme.colors.text,
    margin: 0,
    fontSize: '1rem'
  };

  const addButtonStyle = (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: disabled ? theme.colors.disabled : theme.colors.primary,
    color: disabled ? theme.colors.textMuted : theme.colors.textOnPrimary,
    borderRadius: '12px',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: disabled ? 'none' : `0 2px 4px ${theme.colors.shadow}`
  });

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: `${theme.colors.primary}10`,
    border: `1px solid ${theme.colors.primary}30`,
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem'
  };

  const infoTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme.colors.text,
    margin: 0,
    lineHeight: '1.4'
  };

  // Sort fields to show defaults first
  const sortedFields = [...(formData.dynamicFields || [])].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>Custom Form Fields</span>
        <button
          type="button"
          onClick={resetToDefaults}
          style={resetButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
            e.currentTarget.style.borderColor = theme.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        >
          Reset to Defaults
        </button>
      </div>

      <div style={infoBoxStyle}>
        <p style={infoTextStyle}>
          <strong>Default Fields:</strong> Full Name, Phone Number, and Wilaya are provided by default and cannot be removed. 
          You can modify their placeholders, toggle required status, or add additional custom fields below.
        </p>
      </div>

      {/* Existing Dynamic Fields */}
      {sortedFields && sortedFields.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sortedFields.map((field, index) => (
            <div key={`${field.key}-${index}`} style={fieldCardStyle(field.isDefault || false)}>
              <div style={fieldHeaderStyle}>
                <span style={fieldLabelStyle(field.isDefault || false)}>
                  {field.isDefault && <FiLock size={12} />}
                  {getFieldLabel(field, index)}
                </span>
                <button
                  type="button"
                  onClick={() => removeDynamicField(index)}
                  style={deleteButtonStyle(field.isDefault || false)}
                  disabled={field.isDefault}
                  onMouseEnter={(e) => {
                    if (!field.isDefault) {
                      e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!field.isDefault) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  aria-label={field.isDefault ? 'Cannot remove default field' : `Remove field ${field.key}`}
                  title={field.isDefault ? 'Default fields cannot be removed' : 'Remove field'}
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
                  disabled={field.isDefault}
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

              <div style={checkboxContainerStyle}>
                <input
                  type="checkbox"
                  id={`required-${index}`}
                  checked={field.isRequired || false}
                  onChange={(e) => updateDynamicField(index, 'isRequired', e.target.checked)}
                  style={checkboxStyle}
                />
                <label htmlFor={`required-${index}`} style={checkboxLabelStyle}>
                  Required field {field.isDefault && '(Default field - admin can modify)'}
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : null}

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
            placeholder="e.g., size, color, brand"
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
        
        <div style={checkboxContainerStyle}>
          <input
            type="checkbox"
            id="newField-required"
            checked={newField.isRequired || false}
            onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
            style={checkboxStyle}
          />
          <label htmlFor="newField-required" style={checkboxLabelStyle}>
            Required field
          </label>
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
              e.currentTarget.style.boxShadow = `0 4px 8px ${theme.colors.shadow}`;
            }
          }}
          onMouseLeave={(e) => {
            if (!(!newField.key?.trim() || !newField.placeholder?.trim())) {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 4px ${theme.colors.shadow}`;
            }
          }}
        >
          Add Custom Field
        </button>
      </div>
    </div>
  );
};

export default DynamicFieldsTab;