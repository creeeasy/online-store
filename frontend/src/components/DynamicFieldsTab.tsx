import React, { useState, useEffect, useMemo } from 'react';
import { FiTrash2, FiLock } from 'react-icons/fi';
import type { IProduct, IDynamicField } from '../types/product';
import { ValidatedInput } from './ValidationErrorDisplay';

interface DynamicFieldsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors?: any;
}

// Default required fields for every product
const DEFAULT_DYNAMIC_FIELDS: Omit<IDynamicField, '_id'>[] = [
  { key: 'fullName', placeholder: 'Enter your full name', isRequired: true, isDefault: true },
  { key: 'phoneNumber', placeholder: 'Enter your phone number (e.g., 0555123456)', isRequired: true, isDefault: true },
  { key: 'wilaya', placeholder: 'Select your wilaya', isRequired: true, isDefault: true }
];

const DynamicFieldsTab: React.FC<DynamicFieldsTabProps> = ({ formData, setFormData, validationErrors }) => {
  const [newField, setNewField] = useState<Omit<IDynamicField, '_id'>>({
    key: '',
    placeholder: '',
    isRequired: false,
    isDefault: false,
  });

  /**
   * 🔹 Normalize API errors into { "dynamicFields.0.key": ["message"] }
   */
  const buildErrorMap = (errs: any): Record<string, string[]> => {
    const map: Record<string, string[]> = {};
    if (!errs) return map;

    if (typeof errs === 'object' && !Array.isArray(errs)) {
      for (const key of Object.keys(errs)) {
        const val = errs[key];
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

  /**
   * 🔹 Initialize dynamic fields with defaults
   */
  useEffect(() => {
    if (!formData.dynamicFields || formData.dynamicFields.length === 0) {
      setFormData(prev => ({
        ...prev,
        dynamicFields: DEFAULT_DYNAMIC_FIELDS.map(field => ({ ...field } as IDynamicField)),
      }));
    } else {
      const existingKeys = formData.dynamicFields.map(field => field.key);
      const missingDefaults = DEFAULT_DYNAMIC_FIELDS.filter(df => !existingKeys.includes(df.key));
      if (missingDefaults.length > 0) {
        setFormData(prev => ({
          ...prev,
          dynamicFields: [
            ...missingDefaults.map(f => ({ ...f } as IDynamicField)),
            ...(prev.dynamicFields || []),
          ],
        }));
      }
    }
  }, [formData.dynamicFields, setFormData]);

  /**
   * 🔹 Add a new dynamic field
   */
  const addDynamicField = () => {
    if (!newField.key.trim()) return;
    setFormData(prev => ({
      ...prev,
      dynamicFields: [...(prev.dynamicFields || []), { ...newField } as IDynamicField],
    }));
    setNewField({ key: '', placeholder: '', isRequired: false, isDefault: false });
  };

  /**
   * 🔹 Update a specific field
   */
  const updateDynamicField = (index: number, field: keyof IDynamicField, value: any) => {
    setFormData(prev => {
      const updatedFields = [...(prev.dynamicFields || [])];
      updatedFields[index] = { ...updatedFields[index], [field]: value };
      return { ...prev, dynamicFields: updatedFields };
    });
  };

  /**
   * 🔹 Remove a field (only if not default)
   */
  const removeDynamicField = (index: number) => {
    setFormData(prev => {
      const updatedFields = [...(prev.dynamicFields || [])];
      updatedFields.splice(index, 1);
      return { ...prev, dynamicFields: updatedFields };
    });
  };

  /**
   * 🔹 Styles (adapted for light/dark theme)
   */
  const styles = {
    section: {
      marginBottom: '2rem',
    },
    card: {
      background:  '#F8FAFC',
      border: `1px solid #E2E8F0'}`,
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
    },
    inputGroup: {
      marginBottom: '0.8rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.3rem',
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#334155',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '6px',
      border: `1px solid #CBD5E1'}`,
      background: 'white',
      color: 'black',
    },
    checkbox: {
      marginRight: '0.5rem',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.5rem',
    },
    button: {
      background: '#E2E8F0',
      border: 'none',
      padding: '0.4rem 0.8rem',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    deleteButton: {
      background: '#DC2626',
      color: 'white',
    },
  };

  return (
    <div style={styles.section}>
      <h3 style={{ marginBottom: '1rem' }}>Dynamic Fields</h3>

      {/* Existing dynamic fields */}
      {(formData.dynamicFields || []).map((field, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.inputGroup}>
            <ValidatedInput
              label="Field Key"
              fieldName={`dynamicFields.${index}.key`}
              errors={normalizedErrors}
              value={field.key}
              onChange={e => updateDynamicField(index, 'key', e.target.value)}
              disabled={field.isDefault}
            />
          </div>

          <div style={styles.inputGroup}>
            <ValidatedInput
              label="Placeholder"
              fieldName={`dynamicFields.${index}.placeholder`}
              errors={normalizedErrors}
              value={field.placeholder}
              onChange={e => updateDynamicField(index, 'placeholder', e.target.value)}
            />
          </div>

          <div style={styles.actions}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={field.isRequired}
                onChange={e => updateDynamicField(index, 'isRequired', e.target.checked)}
                disabled={field.isDefault}
              />
              Required
            </label>

            {field.isDefault ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748B' }}>
                <FiLock size={14} /> Default
              </span>
            ) : (
              <button
                type="button"
                style={{ ...styles.button, ...styles.deleteButton }}
                onClick={() => removeDynamicField(index)}
              >
                <FiTrash2 /> Remove
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add new dynamic field */}
      <div style={{ ...styles.card, marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Add New Field</h4>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Field Key</label>
          <input
            type="text"
            value={newField.key}
            onChange={e => setNewField({ ...newField, key: e.target.value })}
            style={styles.input}
            placeholder="e.g., address"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Placeholder</label>
          <input
            type="text"
            value={newField.placeholder}
            onChange={e => setNewField({ ...newField, placeholder: e.target.value })}
            style={styles.input}
            placeholder="Enter placeholder text"
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={newField.isRequired}
            onChange={e => setNewField({ ...newField, isRequired: e.target.checked })}
          />
          Required
        </label>

        <button
          type="button"
          onClick={addDynamicField}
          disabled={!newField.key.trim()}
          style={{
            ...styles.button,
            background: !newField.key.trim() ? '#94A3B8' : '#2563EB',
            color: 'white',
            cursor: !newField.key.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Add Dynamic Field
        </button>
      </div>
    </div>
  );
};

export default DynamicFieldsTab;
