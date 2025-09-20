// components/ValidationErrorDisplay.tsx
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

interface ValidationErrorDisplayProps {
  errors: Record<string, string[]>;
  fieldName?: string;
  className?: string;
  showIcon?: boolean;
  style?: React.CSSProperties;
}

const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  fieldName,
  className = '',
  showIcon = true,
  style = {}
}) => {
  const { theme } = useTheme();
  
  // If fieldName is provided, show only errors for that field
  const relevantErrors = fieldName 
    ? errors[fieldName] || []
    : Object.values(errors).flat();

  if (relevantErrors.length === 0) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    ...style
  };

  const errorTextStyle: React.CSSProperties = {
    color: '#ef4444', // red-600
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: '1.25rem'
  };

  return (
    <div style={containerStyle} className={className}>
      {showIcon && (
        <FiAlertCircle 
          color="#ef4444" 
          size={16} 
          style={{ marginTop: '2px', flexShrink: 0 }} 
        />
      )}
      <div style={{ flex: 1 }}>
        {relevantErrors.map((error, index) => (
          <p key={index} style={errorTextStyle}>
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
  style?: React.CSSProperties;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  children,
  className = '',
  style = {}
}) => {
  const { theme } = useTheme();
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    ...style
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  };

  const requiredStyle: React.CSSProperties = {
    color: '#ef4444',
    marginLeft: theme.spacing.xs
  };

  const inputWrapperStyle: React.CSSProperties = {
    ...(hasErrors && {
      outline: '2px solid #ef4444',
      outlineOffset: '2px',
      borderRadius: theme.borderRadius.lg,
      outlineStyle: 'solid'
    })
  };

  return (
    <div style={containerStyle} className={className}>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStyle}>*</span>}
      </label>
      
      <div style={inputWrapperStyle}>
        {children}
      </div>
      
      <ValidationErrorDisplay 
        errors={errors} 
        fieldName={fieldName}
        style={{ marginTop: theme.spacing.xs }}
      />
    </div>
  );
};

// Input component with built-in validation display
interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  customStyle?: React.CSSProperties;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  className = '',
  customStyle = {},
  ...props
}) => {
  const { theme } = useTheme();
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${hasErrors ? '#fca5a5' : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    lineHeight: '1.5',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    ...customStyle,
    ...(hasErrors ? {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    } : {
      '&:focus': {
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 3px ${theme.colors.primary}20`
      }
    })
  };

  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <input
        {...props}
        style={inputStyle}
        className={className}
        onFocus={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.border;
            e.target.style.boxShadow = 'none';
          }
          props.onBlur?.(e);
        }}
      />
    </FieldWrapper>
  );
};

// Textarea component with built-in validation display
interface ValidatedTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  customStyle?: React.CSSProperties;
}

export const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  className = '',
  customStyle = {},
  ...props
}) => {
  const { theme } = useTheme();
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${hasErrors ? '#fca5a5' : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    lineHeight: '1.5',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    resize: 'vertical',
    minHeight: '100px',
    ...customStyle,
    ...(hasErrors ? {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    } : {})
  };

  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <textarea
        {...props}
        style={textareaStyle}
        className={className}
        onFocus={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.border;
            e.target.style.boxShadow = 'none';
          }
          props.onBlur?.(e);
        }}
      />
    </FieldWrapper>
  );
};

// Select component with built-in validation display
interface ValidatedSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'style'> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  customStyle?: React.CSSProperties;
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  options,
  placeholder,
  className = '',
  customStyle = {},
  ...props
}) => {
  const { theme } = useTheme();
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${hasErrors ? '#fca5a5' : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    lineHeight: '1.5',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    cursor: 'pointer',
    ...customStyle,
    ...(hasErrors ? {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    } : {})
  };

  const optionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: theme.spacing.sm
  };

  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <select
        {...props}
        style={selectStyle}
        className={className}
        onFocus={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.border;
            e.target.style.boxShadow = 'none';
          }
          props.onBlur?.(e);
        }}
      >
        {placeholder && (
          <option value="" disabled style={optionStyle}>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value} style={optionStyle}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
};

// File Input component with validation
interface ValidatedFileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'type'> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  customStyle?: React.CSSProperties;
}

export const ValidatedFileInput: React.FC<ValidatedFileInputProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  acceptedFileTypes = "image/*",
  maxSizeInMB = 5,
  className = '',
  customStyle = {},
  ...props
}) => {
  const { theme } = useTheme();
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  const fileInputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${hasErrors ? '#fca5a5' : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    cursor: 'pointer',
    ...customStyle,
    ...(hasErrors ? {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    } : {})
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs
  };

  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <input
        {...props}
        type="file"
        accept={acceptedFileTypes}
        style={fileInputStyle}
        className={className}
        onFocus={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!hasErrors) {
            e.target.style.borderColor = theme.colors.border;
            e.target.style.boxShadow = 'none';
          }
          props.onBlur?.(e);
        }}
      />
      <p style={helperTextStyle}>
        Accepted formats: {acceptedFileTypes}. Max size: {maxSizeInMB}MB
      </p>
    </FieldWrapper>
  );
};

// Checkbox component with validation
interface ValidatedCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'type'> {
  label: string;
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  description?: string;
  customStyle?: React.CSSProperties;
}

export const ValidatedCheckbox: React.FC<ValidatedCheckboxProps> = ({
  label,
  fieldName,
  errors,
  required = false,
  description,
  className = '',
  customStyle = {},
  ...props
}) => {
  const { theme } = useTheme();
  const hasErrors = errors[fieldName] && errors[fieldName].length > 0;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    ...customStyle
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.sm
  };

  const checkboxStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    marginTop: '2px',
    accentColor: theme.colors.primary,
    cursor: 'pointer'
  };

  const labelContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    cursor: 'pointer',
    flex: 1
  };

  const labelTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    lineHeight: '1.25'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    lineHeight: '1.4'
  };

  const requiredStyle: React.CSSProperties = {
    color: '#ef4444',
    marginLeft: theme.spacing.xs
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={checkboxContainerStyle}>
        <input
          {...props}
          type="checkbox"
          style={checkboxStyle}
        />
        <label style={labelContentStyle}>
          <span style={labelTextStyle}>
            {label}
            {required && <span style={requiredStyle}>*</span>}
          </span>
          {description && (
            <span style={descriptionStyle}>{description}</span>
          )}
        </label>
      </div>
      
      <ValidationErrorDisplay 
        errors={errors} 
        fieldName={fieldName}
        showIcon={true}
      />
    </div>
  );
};

export default ValidationErrorDisplay;

