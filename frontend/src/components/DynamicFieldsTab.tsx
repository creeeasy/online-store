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
  { key: 'fullName', placeholder: 'أدخل اسمك الكامل', isRequired: true, isDefault: true, fontText: '', fontSize: '', languageField: 'ar' },
  { key: 'phoneNumber', placeholder: 'أدخل رقم هاتفك (على سبيل المثال، 0555442462)', isRequired: true, isDefault: true, fontText: '', fontSize: '', languageField: 'ar' },
  { key: 'wilaya', placeholder: 'اختر ولايتك', isRequired: true, isDefault: true, fontText: '', fontSize: '', languageField: 'ar' }
];

// Font family options
const FONT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Palatino, serif', label: 'Palatino' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
  { value: 'Impact, fantasy', label: 'Impact' },
  { value: 'Lucida Console, monospace', label: 'Lucida Console' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Cairo, sans-serif', label: 'Cairo (Arabic)' },
  { value: 'Tajawal, sans-serif', label: 'Tajawal (Arabic)' },
  { value: 'Almarai, sans-serif', label: 'Almarai (Arabic)' },
  { value: 'Amiri, serif', label: 'Amiri (Arabic)' },
];

const DynamicFieldsTab: React.FC<DynamicFieldsTabProps> = ({ formData, setFormData, validationErrors }) => {
  const [newField, setNewField] = useState<Omit<IDynamicField, '_id'>>({
    key: '',
    placeholder: '',
    isRequired: false,
    isDefault: false,
    fontText: '',
    fontSize: '',
    languageField: 'fr'
  });

  // Get globalLanguage from the first dynamic field's languageField, default to 'fr'
  const globalLanguage = formData.dynamicFields && formData.dynamicFields.length > 0 
    ? formData.dynamicFields[0].languageField as 'fr' | 'ar'
    : 'fr';

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
        dynamicFields: DEFAULT_DYNAMIC_FIELDS.map(field => ({ ...field, languageField: globalLanguage } as IDynamicField)),
      }));
    } else {
      const existingKeys = formData.dynamicFields.map(field => field.key);
      const missingDefaults = DEFAULT_DYNAMIC_FIELDS.filter(df => !existingKeys.includes(df.key));
      if (missingDefaults.length > 0) {
        setFormData(prev => ({
          ...prev,
          dynamicFields: [
            ...missingDefaults.map(f => ({ ...f, languageField: globalLanguage } as IDynamicField)),
            ...(prev.dynamicFields || []),
          ],
        }));
      }
    }
  }, [formData.dynamicFields, setFormData, globalLanguage]);

  /**
   * 🔹 Update global language for all fields
   */
  const updateGlobalLanguage = (language: 'fr' | 'ar') => {
    if (formData.dynamicFields && formData.dynamicFields.length > 0) {
      setFormData(prev => ({
        ...prev,
        dynamicFields: prev.dynamicFields?.map(field => ({
          ...field,
          languageField: language
        }))
      }));
    }
  };

  /**
   * 🔹 Add a new dynamic field
   */
  const addDynamicField = () => {
    if (!newField.key.trim()) return;
    setFormData(prev => ({
      ...prev,
      dynamicFields: [...(prev.dynamicFields || []), { ...newField, languageField: globalLanguage } as IDynamicField],
    }));
    setNewField({ key: '', placeholder: '', isRequired: false, isDefault: false, fontText: '', fontSize: '', languageField: globalLanguage });
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
    select: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '6px',
      border: `1px solid #CBD5E1'}`,
      background: 'white',
      color: 'black',
      cursor: 'pointer',
    },
    fontPreview: {
      marginTop: '0.5rem',
      padding: '0.75rem',
      background: 'white',
      border: '1px solid #CBD5E1',
      borderRadius: '6px',
      fontSize: '1rem',
      color: '#334155',
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

      {/* Global Language Selector */}
      <div style={{ ...styles.card, marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Global Language Settings</h4>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Language for All Fields</label>
          <select
            style={styles.select}
            value={globalLanguage}
            onChange={e => updateGlobalLanguage(e.target.value as 'fr' | 'ar')}
          >
            <option value="fr">French (FR)</option>
            <option value="ar">Arabic (AR)</option>
          </select>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.5rem' }}>
          Changing this will update the language for all existing and new dynamic fields.
        </p>
      </div>

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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Font Family</label>
            <select
              style={styles.select}
              value={field.fontText || ''}
              onChange={e => updateDynamicField(index, 'fontText', e.target.value)}
            >
              {FONT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Font Size (px)</label>
            <input
              type="number"
              style={styles.input}
              value={field.fontSize || ''}
              onChange={e => updateDynamicField(index, 'fontSize', e.target.value)}
              placeholder="e.g., 16"
              min="1"
            />
          </div>


          {(field.fontText || field.fontSize) && (
            <div style={{ 
              ...styles.fontPreview, 
              fontFamily: field.fontText || 'inherit',
              fontSize: field.fontSize ? `${field.fontSize}px` : '1rem',
              direction: field.languageField === 'ar' ? 'rtl' : 'ltr'
            }}>
              Preview: {field.placeholder || 'Sample text in selected font'}
            </div>
          )}

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

        <div style={styles.inputGroup}>
          <label style={styles.label}>Font Family</label>
          <select
            style={styles.select}
            value={newField.fontText}
            onChange={e => setNewField({ ...newField, fontText: e.target.value })}
          >
            {FONT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Font Size (px)</label>
          <input
            type="number"
            style={styles.input}
            value={newField.fontSize}
            onChange={e => setNewField({ ...newField, fontSize: e.target.value })}
            placeholder="e.g., 16"
            min="1"
          />
        </div>

        {(newField.fontText || newField.fontSize) && (
          <div style={{ 
            ...styles.fontPreview, 
            fontFamily: newField.fontText || 'inherit',
            fontSize: newField.fontSize ? `${newField.fontSize}px` : '1rem',
            direction: newField.languageField === 'ar' ? 'rtl' : 'ltr'
          }}>
            Preview: {newField.placeholder || 'Sample text in selected font'}
          </div>
        )}

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