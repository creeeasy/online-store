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
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: `${theme.colors.error}08`,
    border: `1px solid ${theme.colors.error}30`,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
    animation: 'slideIn 0.3s ease-out',
    ...style
  };

  const errorTextStyle: React.CSSProperties = {
    color: theme.colors.error,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    margin: 0,
    lineHeight: theme.fonts.lineHeight.snug,
    fontFamily: theme.fonts.family.body,
  };

  const iconStyle: React.CSSProperties = {
    marginTop: '2px',
    flexShrink: 0,
    color: theme.colors.error,
  };

  // Inject animation keyframes
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-10px);
          max-height: 0;
        }
        to { 
          opacity: 1;
          transform: translateY(0);
          max-height: 100px;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={containerStyle} className={className}>
      {showIcon && (
        <FiAlertCircle 
          size={16} 
          style={iconStyle}
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
    marginBottom: theme.spacing.lg,
    ...style
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.fonts.family.heading,
    letterSpacing: theme.fonts.letterSpacing.wide,
  };

  const requiredStyle: React.CSSProperties = {
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fonts.weight.bold,
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    ...(hasErrors && {
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: '-2px',
        borderRadius: theme.borderRadius.lg,
        padding: '2px',
        background: `linear-gradient(135deg, ${theme.colors.error}, ${theme.colors.error}80)`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'xor',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        pointerEvents: 'none',
      }
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
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `2px solid ${hasErrors ? theme.colors.error : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: theme.transitions.fast,
    fontSize: theme.fonts.size.md,
    lineHeight: theme.fonts.lineHeight.normal,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.fonts.family.body,
    ...customStyle,
    ...(hasErrors ? {
      borderColor: theme.colors.error,
      boxShadow: `0 0 0 3px ${theme.colors.error}20`,
      backgroundColor: `${theme.colors.error}05`,
    } : {})
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
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `2px solid ${hasErrors ? theme.colors.error : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: theme.transitions.fast,
    fontSize: theme.fonts.size.md,
    lineHeight: theme.fonts.lineHeight.normal,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.fonts.family.body,
    resize: 'vertical',
    minHeight: '120px',
    ...customStyle,
    ...(hasErrors ? {
      borderColor: theme.colors.error,
      boxShadow: `0 0 0 3px ${theme.colors.error}20`,
      backgroundColor: `${theme.colors.error}05`,
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
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `2px solid ${hasErrors ? theme.colors.error : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: theme.transitions.fast,
    fontSize: theme.fonts.size.md,
    lineHeight: theme.fonts.lineHeight.normal,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.fonts.family.body,
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,${encodeURIComponent(`<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L13 1" stroke="${theme.colors.textSecondary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`)}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: theme.spacing['3xl'],
    ...customStyle,
    ...(hasErrors ? {
      borderColor: theme.colors.error,
      boxShadow: `0 0 0 3px ${theme.colors.error}20`,
      backgroundColor: `${theme.colors.error}05`,
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
    padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
    border: `2px dashed ${hasErrors ? theme.colors.error : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    outline: 'none',
    transition: theme.transitions.fast,
    fontSize: theme.fonts.size.md,
    backgroundColor: hasErrors ? `${theme.colors.error}05` : theme.colors.backgroundSecondary,
    color: theme.colors.text,
    fontFamily: theme.fonts.family.body,
    cursor: 'pointer',
    textAlign: 'center',
    ...customStyle,
    ...(hasErrors ? {
      borderColor: theme.colors.error,
      boxShadow: `0 0 0 3px ${theme.colors.error}20`,
    } : {})
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  };

  return (
    <FieldWrapper
      label={label}
      fieldName={fieldName}
      errors={errors}
      required={required}
    >
      <div>
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
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
            e.currentTarget.style.borderColor = theme.colors.primary;
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.backgroundColor = hasErrors ? `${theme.colors.error}05` : theme.colors.backgroundSecondary;
            e.currentTarget.style.borderColor = hasErrors ? theme.colors.error : theme.colors.border;
          }}
        />
        <p style={helperTextStyle}>
          Accepted formats: {acceptedFileTypes} • Max size: {maxSizeInMB}MB
        </p>
      </div>
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
    marginBottom: theme.spacing.lg,
    ...customStyle
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${hasErrors ? theme.colors.error : 'transparent'}`,
    backgroundColor: hasErrors ? `${theme.colors.error}05` : 'transparent',
    transition: theme.transitions.fast,
  };

  const checkboxStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    marginTop: '2px',
    accentColor: theme.colors.primary,
    cursor: 'pointer',
    borderRadius: theme.borderRadius.sm,
  };

  const labelContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    cursor: 'pointer',
    flex: 1
  };

  const labelTextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    lineHeight: theme.fonts.lineHeight.snug,
    fontFamily: theme.fonts.family.heading,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
    fontFamily: theme.fonts.family.body,
  };

  const requiredStyle: React.CSSProperties = {
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fonts.weight.bold,
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