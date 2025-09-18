import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import type { IProduct, IDynamicField } from '../types/product';
import { ValidatedInput } from './ValidationErrorDisplay';

interface DynamicFieldsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const DynamicFieldsTab: React.FC<DynamicFieldsTabProps> = ({ formData, setFormData, validationErrors }) => {
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

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Form Fields</h3>

      <div className="space-y-3 mb-4">
        {(formData.dynamicFields || []).map((field, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Dynamic Field {index + 1}</span>
              <button
                type="button"
                onClick={() => removeDynamicField(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-700">Add Custom Field</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Field
        </button>
      </div>
    </div>
  );
};

export default DynamicFieldsTab;