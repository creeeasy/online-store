import React, { useState, useEffect } from 'react';
import type { DynamicField } from '../types/types';
import { WilayaSelect } from './WilayaInput';

interface ValidationError {
  field?: string;
  message: string;
}

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

  const validateAlgerianPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^0[567]\d{8}$/;
    return phoneRegex.test(cleanPhone);
  };

  const validateFullName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,100}$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 2;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const errors: Record<string, string> = {};
    
    dynamicFields.forEach(field => {
      const fieldValue = formData[field.key];
      if (field.key === 'name' && (!fieldValue?.trim() || !validateFullName(fieldValue))) {
        errors[field.key] = 'Full name must be 2-100 characters and contain only letters';
      } else if (field.key === 'phone' && (!fieldValue?.trim() || !validateAlgerianPhone(fieldValue))) {
        errors[field.key] = 'Phone number must be 10 digits starting with 05, 06, or 07';
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    onSubmit(formData);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  };

  const getInputType = (fieldKey: string): string => {
    if (fieldKey.toLowerCase().includes('phone')) return 'tel';
    if (fieldKey.toLowerCase().includes('email')) return 'email';
    return 'text';
  };

  const isFieldRequired = (fieldKey: string): boolean => {
    const requiredFields = ['name', 'phone'];
    return requiredFields.includes(fieldKey.toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="productId" value={productId} />
      
      {dynamicFields.map((field) => (
        <div key={field.key}>
         {field.key.toLowerCase() !== 'wilaya' && (   <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {field.key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            {isFieldRequired(field.key) && <span className="text-red-500 ml-1">*</span>}
          </label>
     ) }
          {/* ✅ Special case for wilaya */}
          {field.key.toLowerCase() === 'wilaya' ? (
            <WilayaSelect
              fieldName={field.key}
              errors={{ [field.key]: getFieldError(field.key) ? [getFieldError(field.key)!] : [] }}
              required={isFieldRequired(field.key)}
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
            />
          ) : (
            <input
              type={getInputType(field.key)}
              id={field.key}
              name={field.key}
              required={isFieldRequired(field.key)}
              placeholder={field.placeholder || `Enter your ${field.key.toLowerCase()}`}
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                getFieldError(field.key) ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={submitting}
            />
          )}

          {getFieldError(field.key) && (
            <p className="mt-1 text-sm text-red-600">{getFieldError(field.key)}</p>
          )}
        </div>
      ))}

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
