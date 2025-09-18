import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import type { IProduct, IHiddenField } from '../types/product';
import { ValidatedInput } from './ValidationErrorDisplay';

interface HiddenFieldsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const HiddenFieldsTab: React.FC<HiddenFieldsTabProps> = ({ formData, setFormData, validationErrors }) => {
  const [newHiddenField, setNewHiddenField] = useState<Partial<IHiddenField>>({ key: '', value: '', description: '' });

  const addHiddenField = () => {
    if (!newHiddenField.key?.trim()) return;

    setFormData(prev => ({
      ...prev,
      hiddenFields: [...(prev.hiddenFields || []), { ...newHiddenField } as IHiddenField]
    }));
    setNewHiddenField({ key: '', value: '', description: '' });
  };

  const removeHiddenField = (index: number) => {
    const newHiddenFields = (formData.hiddenFields || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, hiddenFields: newHiddenFields }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Hidden Tracking Fields</h3>
      <p className="text-sm text-gray-600 mb-4">
        These fields will be stored with submissions but not shown to customers.
      </p>

      <div className="space-y-3 mb-4">
        {(formData.hiddenFields || []).map((field, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Hidden Field {index + 1}</span>
              <button
                type="button"
                onClick={() => removeHiddenField(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ValidatedInput
                label="Field Key"
                fieldName={`hiddenFields.${index}.key`}
                errors={validationErrors}
                required
                type="text"
                value={field.key}
                onChange={(e) => {
                  const newFields = [...(formData.hiddenFields || [])];
                  newFields[index] = { ...newFields[index], key: e.target.value };
                  setFormData(prev => ({ ...prev, hiddenFields: newFields }));
                }}
                placeholder="e.g., utm_source"
              />

              <ValidatedInput
                label="Default Value"
                fieldName={`hiddenFields.${index}.value`}
                errors={validationErrors}
                type="text"
                value={field.value}
                onChange={(e) => {
                  const newFields = [...(formData.hiddenFields || [])];
                  newFields[index] = { ...newFields[index], value: e.target.value };
                  setFormData(prev => ({ ...prev, hiddenFields: newFields }));
                }}
                placeholder="Default value"
              />

              <ValidatedInput
                label="Description"
                fieldName={`hiddenFields.${index}.description`}
                errors={validationErrors}
                type="text"
                value={field.description || ''}
                onChange={(e) => {
                  const newFields = [...(formData.hiddenFields || [])];
                  newFields[index] = { ...newFields[index], description: e.target.value };
                  setFormData(prev => ({ ...prev, hiddenFields: newFields }));
                }}
                placeholder="Field description"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-700">Add Hidden Field</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ValidatedInput
            label="Field Key"
            fieldName="newHiddenField.key"
            errors={validationErrors}
            required
            type="text"
            value={newHiddenField.key}
            onChange={(e) => setNewHiddenField({ ...newHiddenField, key: e.target.value })}
            placeholder="e.g., utm_source"
          />

          <ValidatedInput
            label="Default Value"
            fieldName="newHiddenField.value"
            errors={validationErrors}
            type="text"
            value={newHiddenField.value}
            onChange={(e) => setNewHiddenField({ ...newHiddenField, value: e.target.value })}
            placeholder="Default value"
          />

          <ValidatedInput
            label="Description"
            fieldName="newHiddenField.description"
            errors={validationErrors}
            type="text"
            value={newHiddenField.description}
            onChange={(e) => setNewHiddenField({ ...newHiddenField, description: e.target.value })}
            placeholder="Field description"
          />
        </div>
        <button
          type="button"
          onClick={addHiddenField}
          disabled={!newHiddenField.key?.trim()}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Hidden Field
        </button>
      </div>
    </div>
  );
};

export default HiddenFieldsTab;