import React, { useState } from 'react';
import type { DynamicField } from '../types/types';

interface DynamicFormProps {
  productId: string;
  dynamicFields: DynamicField[];
  onSubmit: (data: Record<string, string>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ productId, dynamicFields, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return '';
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    setFocusedField(null);
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    newErrors.name = validateField('name', formData.name);
    newErrors.phone = validateField('phone', formData.phone);
    
    // Validate dynamic fields
    dynamicFields.forEach(field => {
      const value = formData[field.key] || '';
      const error = validateField(field.key, value);
      if (error) newErrors[field.key] = error;
    });

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus on first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      errorElement?.focus();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'name':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          {getFieldIcon('name')}
          Full Name *
        </label>
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
            required
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white ${
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : focusedField === 'name'
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            } outline-none placeholder-gray-400`}
            placeholder="Enter your full name"
          />
          {focusedField === 'name' && !errors.name && (
            <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
              This helps us personalize your experience
            </div>
          )}
        </div>
        {errors.name && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.name}
          </div>
        )}
      </div>
      
      {/* Phone Field */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          {getFieldIcon('phone')}
          Phone Number *
        </label>
        <div className="relative">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => handleFocus('phone')}
            onBlur={handleBlur}
            required
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white ${
              errors.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : focusedField === 'phone'
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            } outline-none placeholder-gray-400`}
            placeholder="+1 (555) 123-4567"
          />
          {focusedField === 'phone' && !errors.phone && (
            <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
              We'll use this to contact you about your inquiry
            </div>
          )}
        </div>
        {errors.phone && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.phone}
          </div>
        )}
      </div>

      {/* Dynamic Fields */}
      {dynamicFields.map((field) => (
        <div key={field.key} className="space-y-2">
          <label htmlFor={field.key} className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            {getFieldIcon(field.key)}
            {field.key.charAt(0).toUpperCase() + field.key.slice(1)}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            {field.key === 'message' || field.key === 'comments' ? (
              <textarea
                id={field.key}
                name={field.key}
                value={formData[field.key] || ''}
                onChange={handleChange}
                onFocus={() => handleFocus(field.key)}
                onBlur={handleBlur}
                required={field.required}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white resize-none ${
                  errors[field.key]
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : focusedField === field.key
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                } outline-none placeholder-gray-400`}
                placeholder={field.placeholder || `Enter your ${field.key}`}
              />
            ) : (
              <input
                type="text"
                id={field.key}
                name={field.key}
                value={formData[field.key] || ''}
                onChange={handleChange}
                onFocus={() => handleFocus(field.key)}
                onBlur={handleBlur}
                required={field.required}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white ${
                  errors[field.key]
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : focusedField === field.key
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                } outline-none placeholder-gray-400`}
                placeholder={field.placeholder || `Enter your ${field.key}`}
              />
            )}
          </div>
          {errors[field.key] && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.key]}
            </div>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
          isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            Submitting...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit Inquiry
          </div>
        )}
      </button>

      {/* Privacy Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your information is secure and will not be shared with third parties
        </p>
      </div>
    </form>
  );
};

export default DynamicForm;