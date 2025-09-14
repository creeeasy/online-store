// components/DynamicForm.tsx
import React, { useState } from 'react';
import type { DynamicField } from '../types/types';

interface DynamicFormProps {
  productId: string;
  dynamicFields: DynamicField[];
  onSubmit: (formData: Record<string, string>) => void;
  submitting?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  productId, 
  dynamicFields, 
  onSubmit, 
  submitting = false 
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden product ID */}
      <input type="hidden" name="productId" value={productId} />
      
      {/* Required fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter your full name"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          disabled={submitting}
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          placeholder="Enter your phone number"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          disabled={submitting}
        />
      </div>
      
      {/* Dynamic fields */}
      {dynamicFields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {field.key.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </label>
          <input
            type="text"
            id={field.key}
            name={field.key}
            placeholder={field.placeholder}
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            disabled={submitting}
          />
        </div>
      ))}
      
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {submitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
};

export default DynamicForm;