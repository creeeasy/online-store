// components/PredefinedFields.tsx
import React, { useState } from 'react';
import type { PredefinedFieldGroup } from '../types/types';
import { PREDEFINED_CATEGORIES } from '../data/predefinedFields';

interface PredefinedFieldsProps {
  fields: PredefinedFieldGroup[];
}

const PredefinedFields: React.FC<PredefinedFieldsProps> = ({ fields }) => {
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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Product Specifications</h3>
      
      <div className="space-y-6">
        {fields.map((fieldGroup, index) => (
          fieldGroup.isActive && (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <h4 className="font-medium text-gray-700 mb-2 capitalize">{fieldGroup.category}</h4>
              <div className="flex flex-wrap gap-2">
                {fieldGroup.selectedOptions.map((option, optIndex) => (
                  <span 
                    key={optIndex}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )
        ))}
        
        {/* Custom fields section */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Additional Information</h4>
          {customFields.map((field, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Field name"
                value={field.key}
                onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Field value"
                value={field.value}
                onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={() => removeCustomField(index)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addCustomField}
            className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            + Add Custom Field
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