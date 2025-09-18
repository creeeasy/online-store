import React from 'react';
import type { IProduct } from '../types/product';

interface PredefinedTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
}

const PredefinedTab: React.FC<PredefinedTabProps> = ({ formData, setFormData }) => {
  const handlePredefinedFieldToggle = (category: string, isActive: boolean) => {
    setFormData(prev => ({
      ...prev,
      predefinedFields: (prev.predefinedFields || []).map(field =>
        field.category === category ? { ...field, isActive } : field
      )
    }));
  };

  const handlePredefinedOptionToggle = (category: string, option: string, isSelected: boolean) => {
    setFormData(prev => ({
      ...prev,
      predefinedFields: (prev.predefinedFields || []).map(field => {
        if (field.category === category) {
          const selectedOptions = isSelected
            ? [...field.selectedOptions, option]
            : field.selectedOptions.filter(opt => opt !== option);
          return { ...field, selectedOptions };
        }
        return field;
      })
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
      <div className="space-y-4">
        {(formData.predefinedFields || []).map((field) => (
          <div key={field.category} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-700 capitalize">
                {field.category}
              </label>
              <div className="flex items-center">
                <span className={`text-sm mr-2 ${field.isActive ? 'text-red-600' : 'text-gray-500'}`}>
                  {field.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  type="button"
                  onClick={() => handlePredefinedFieldToggle(field.category, !field.isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    field.isActive ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      field.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            {field.isActive && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Select available options:</p>
                <div className="grid grid-cols-2 gap-2">
                  {field.options.map(option => (
                    <label key={option} className="flex items-center p-2 rounded hover:bg-red-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={field.selectedOptions.includes(option)}
                        onChange={(e) => handlePredefinedOptionToggle(field.category, option, e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredefinedTab;