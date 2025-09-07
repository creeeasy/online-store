// components/ValidationErrorDisplay.tsx
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ValidationErrorDisplayProps {
  errors: Record<string, string[]>;
  fieldName?: string;
  className?: string;
  showIcon?: boolean;
}

const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  fieldName,
  className = '',
  showIcon = true
}) => {
  // If fieldName is provided, show only errors for that field
  const relevantErrors = fieldName 
    ? errors[fieldName] || []
    : Object.values(errors).flat();

  if (relevantErrors.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {showIcon && (
        <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
      )}
      <div className="flex-1">
        {relevantErrors.map((error, index) => (
          <p key={index} className="text-red-600 text-sm">
            {error}
          </p>
        ))}
      </div>
    </div>
  );
};

// Field wrapper component that shows validation state
interface FieldWrapperProps {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  children,
  className = ''
}) => {
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className={hasErrors ? 'ring-2 ring-red-500 ring-opacity-20 rounded-lg' : ''}>
        {children}
      </div>
      
      <ValidationErrorDisplay 
        errors={errors} 
        fieldName={fieldName}
        className="mt-1"
      />
    </div>
  );
};

// Input component with built-in validation display
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  className = '',
  ...props
}) => {
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <input
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
          ${hasErrors 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${className}
        `}
      />
    </FieldWrapper>
  );
};

// Textarea component with built-in validation display
interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
}

export const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  className = '',
  ...props
}) => {
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;
  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <textarea
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-vertical
          ${hasErrors 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${className}
        `}
      />
    </FieldWrapper>
  );
};

// Select component with built-in validation display
interface ValidatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  options,
  className = '',
  ...props
}) => {
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <select
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
          ${hasErrors 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${className}
        `}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
};

export default ValidationErrorDisplay;