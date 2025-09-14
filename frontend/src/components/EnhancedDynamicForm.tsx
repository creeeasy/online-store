import React, { useState, useEffect } from 'react';
import type { DynamicField } from '../types/types';

interface EnhancedDynamicFormProps {
  productId: string;
  dynamicFields: DynamicField[];
  onSubmit: (formData: Record<string, string>) => void;
  submitting?: boolean;
  validationErrors?: ValidationError[];
}

const EnhancedDynamicForm: React.FC<EnhancedDynamicFormProps> = ({ 
  productId, 
  dynamicFields, 
  onSubmit, 
  submitting = false,
  validationErrors = []
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update field errors when validation errors change
  useEffect(() => {
    const newFieldErrors: Record<string, string> = {};
    
    validationErrors.forEach(error => {
      if (error.field) {
        newFieldErrors[error.field] = error.message;
      }
    });
    
    setFieldErrors(newFieldErrors);
  }, [validationErrors]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    onSubmit(formData);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden product ID */}
      <input type="hidden" name="productId" value={productId} />
      
      {/* Name Field */}
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
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
            getFieldError('name') ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={submitting}
        />
        {getFieldError('name') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
        )}
      </div>
      
      {/* Phone Field */}
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
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
            getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={submitting}
        />
        {getFieldError('phone') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
        )}
      </div>
      
      {/* Reference Field */}
      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
          Reference (Optional)
        </label>
        <input
          type="text"
          id="reference"
          name="reference"
          placeholder="How did you hear about us?"
          value={formData.reference || ''}
          onChange={(e) => handleInputChange('reference', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          disabled={submitting}
        />
        {getFieldError('reference') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('reference')}</p>
        )}
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
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
              getFieldError(field.key) ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={submitting}
          />
          {getFieldError(field.key) && (
            <p className="mt-1 text-sm text-red-600">{getFieldError(field.key)}</p>
          )}
        </div>
      ))}
      
      {/* General form errors (for non-field specific errors) */}
      {validationErrors.filter(error => !error.field).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-600">
            {validationErrors
              .filter(error => !error.field)
              .map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
          </ul>
        </div>
      )}
      
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

export default EnhancedDynamicForm;