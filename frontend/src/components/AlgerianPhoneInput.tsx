import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import flag from "../assets/flag.svg";

 interface AlgerianPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void; // will receive backend format '0XXXXXXXXX' or '' if cannot normalize
  error?: string;
  required?: boolean;
  placeholder?: string;
}

/* -----------------------
   Utilities
   ----------------------- */
const normalizeDigits = (phone = '') => phone.replace(/[^\d]/g, '');

export const validateAlgerianPhone = (phone: string): boolean => {
  if (!phone) return false;
  const d = normalizeDigits(phone);
  if (/^[567]\d{8}$/.test(d)) return true;          // 9 digits starting with 5/6/7
  if (/^0[567]\d{8}$/.test(d)) return true;         // 10 digits starting with 0
  if (/^213[567]\d{8}$/.test(d)) return true;       // international 213 + 9 digits
  return false;
};

export const formatAlgerianPhone = (phone: string): string => {
  if (!phone) return '';
  const d = normalizeDigits(phone);
  let normalized = d;

  // Turn 9-digit into 10-digit by adding 0, or international into 0 + rest
  if (/^[567]\d{8}$/.test(d)) normalized = '0' + d;
  if (/^213[567]\d{8}$/.test(d)) normalized = '0' + d.slice(3);

  if (/^0[567]\d{8}$/.test(normalized)) {
    // Format as: 0XXX XX XX XX
    return `${normalized.slice(0, 4)} ${normalized.slice(4, 6)} ${normalized.slice(6, 8)} ${normalized.slice(8)}`;
  }

  // fallback: return digits (useful while typing)
  return d;
};

const toBackendFormat = (phone: string): string => {
  const d = normalizeDigits(phone);
  if (/^[567]\d{8}$/.test(d)) return '0' + d;
  if (/^0[567]\d{8}$/.test(d)) return d;
  if (/^213[567]\d{8}$/.test(d)) return '0' + d.slice(3);
  return '';
};

/* -----------------------
   Component
   ----------------------- */
export const AlgerianPhoneInput: React.FC<AlgerianPhoneInputProps> = ({
  value = '',
  onChange,
  error,
  required = false,
  placeholder = "أدخل رقم الهاتف"
}) => {
  const { theme } = useTheme();
  const [displayValue, setDisplayValue] = useState<string>('');

  // initialize from prop value
  useEffect(() => {
    if (value) {
      const formatted = formatAlgerianPhone(value);
      setDisplayValue(formatted || normalizeDigits(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // allow digits, spaces and plus sign while typing
    const raw = e.target.value.replace(/[^\d+\s]/g, '');
    setDisplayValue(raw);

    // send normalized backend format (or empty string if cannot normalize)
    const backendValue = toBackendFormat(raw);
    if (onChange) onChange(backendValue);
  };

  const handleBlur = () => {
    if (!displayValue) return;
    const formatted = formatAlgerianPhone(displayValue);
    setDisplayValue(formatted || displayValue);
  };

  const handleFocus = () => {
    if (!displayValue) return;
    // switch to raw digits for editing
    setDisplayValue(normalizeDigits(displayValue));
  };

  const isValid = displayValue ? validateAlgerianPhone(displayValue) : !required;

  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
<div
  style={{
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    zIndex: 2
  }}
>
  <img src={flag} alt="Algerian flag" width={20} height={15} />
  <span
    style={{
      fontSize: theme.fonts.size.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.fonts.weight.medium
    }}
  >
    +213
  </span>
</div>



        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: theme.spacing.md,
            paddingRight: '100px', // keep space for flag/code
            border: `1px solid ${error ? theme.colors.error : isValid ? theme.colors.success : theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.text,
            fontSize: theme.fonts.size.md,
            direction: 'ltr',     // force left-to-right
            textAlign: 'left'     // text aligned left
          }}
        />
      </div>

      {/* validation feedback */}
      {displayValue && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          marginTop: theme.spacing.xs,
          fontSize: theme.fonts.size.sm
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isValid ? theme.colors.success : theme.colors.error
          }} />
          <span style={{
            color: isValid ? theme.colors.success : theme.colors.error,
            fontWeight: theme.fonts.weight.medium
          }}>
            {isValid ? 'رقم هاتف صحيح' : 'رقم هاتف غير صحيح (يجب أن يبدأ بـ 05, 06, أو 07)'}
          </span>
        </div>
      )}

      {error && (
        <div style={{
          fontSize: theme.fonts.size.sm,
          color: theme.colors.error,
          marginTop: theme.spacing.xs,
          fontWeight: theme.fonts.weight.medium
        }}>{error}</div>
      )}
    </div>
  );
};
