 import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import flag from "../assets/flag.svg";

interface AlgerianPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  hasCustomColors?: boolean;
  colors?: any;
  style?: React.CSSProperties;
}

// ✅ Validation
export const validateAlgerianPhone = (phone: string): boolean => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');

  return (
    /^0[567]\d{8}$/.test(digits) ||  // 0XXXXXXXXX
    /^[567]\d{8}$/.test(digits) ||   // XXXXXXXXX
    /^213[567]\d{8}$/.test(digits)   // 213XXXXXXXXX
  );
};

// ✅ Formatting
export const formatAlgerianPhone = (phone: string): string => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');

  if (/^[567]\d{8}$/.test(digits)) return '0' + digits;
  if (/^0[567]\d{8}$/.test(digits)) return digits;
  if (/^213[567]\d{8}$/.test(digits)) return '0' + digits.slice(3);

  return digits;
};

export const AlgerianPhoneInput: React.FC<AlgerianPhoneInputProps> = ({
  value = '',
  onChange,
  error,
  required = false,
  placeholder,
  hasCustomColors = false,
  colors,
  style
}) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayValue = e.target.value;
    setInputValue(displayValue);

    if (onChange) {
      const formattedPhone = formatAlgerianPhone(displayValue);
      onChange(formattedPhone);
    }
  };

  const isValid = inputValue ? validateAlgerianPhone(inputValue) : true;
  const showError = inputValue && !isValid;

  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'end' }}>
        {/* Flag + country code */}
        <div style={{
          position: 'absolute',
          left: theme.spacing.md,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          zIndex: 2
        }}>
          <img src={flag} alt="Algeria" width={20} height={15} />
          <span style={{
            fontSize: theme.fonts.size.sm,
            color: theme.colors.textSecondary,
            fontWeight: theme.fonts.weight.medium,
            direction: 'ltr'
          }}>
            +213
          </span>
        </div>

        {/* Input */}
        <input
          type="tel"
          required={required}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder || "6xxxxxxxx"}
          style={{
            width: '100%',
            padding: theme.spacing.md,
            paddingLeft: '100px',
            color: theme.colors.text,
            fontSize: theme.fonts.size.md,
            direction: 'ltr',
            border: `2px solid ${
              error
                ? theme.colors.error
                : hasCustomColors
                ? colors.primaryAlpha(0.2)
                : theme.colors.border
            }`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: hasCustomColors
              ? colors.primaryAlpha(0.02)
              : theme.colors.backgroundSecondary,
            boxShadow: hasCustomColors
              ? `0 2px 8px ${colors.primaryAlpha(0.05)}`
              : 'none',
            transition: 'all 0.2s ease',
            ...style,
          }}
          onFocus={(e) => {
            if (hasCustomColors) {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryAlpha(0.1)}`;
            }
          }}
          onBlur={(e) => {
            if (hasCustomColors) {
              e.currentTarget.style.borderColor = colors.primaryAlpha(0.2);
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.primaryAlpha(0.05)}`;
            }
          }}
        />
      </div>

      {/* Show internal error */}
      {showError && (
        <div style={{
          fontSize: theme.fonts.size.sm,
          color: theme.colors.error,
          marginTop: theme.spacing.xs,
          fontWeight: theme.fonts.weight.medium
        }}>
          رقم الهاتف غير صالح
        </div>
      )}

      {/* Show external error */}
      {error && (
        <div style={{
          fontSize: theme.fonts.size.sm,
          color: theme.colors.error,
          marginTop: theme.spacing.xs,
          fontWeight: theme.fonts.weight.medium
        }}>
          {error}
        </div>
      )}
    </div>
  );
};
