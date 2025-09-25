// src/components/ProductForm/QuantityTab.tsx - Fixed version
import React, { useEffect } from "react";
import { FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from "../types/product";
import ErrorDisplay from './ErrorDisplay';
import { getFieldErrors, hasFieldError, type ValidationError } from "../utils/validation";

const PRODUCT_LIMITS = {
  MAX_QUANTITY_PER_INQUIRY_MIN: 1,
  MAX_QUANTITY_PER_INQUIRY_MAX: 1000, // Increased to match validation rules
};

interface QuantityTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, ValidationError[]>;
  handleInputChange: (field: keyof IProduct, value: any) => void;
  hasAttemptedSubmit: boolean;
  allErrors: ValidationError[];
}

const QuantityTab: React.FC<QuantityTabProps> = ({
  formData,
  setFormData,
  validationErrors,
  handleInputChange,
  hasAttemptedSubmit,
  allErrors,
}) => {
  const { theme } = useTheme();
  const tabErrors = validationErrors.quantity || [];

  // Auto-focus first error field when tab becomes active and has errors
  useEffect(() => {
    if (hasAttemptedSubmit && tabErrors.length > 0) {
      const firstError = tabErrors[0];
      const fieldName = firstError.field.split('.')[0];
      const element = document.querySelector(`input[name="${fieldName}"]`) as HTMLElement;
      if (element) {
        setTimeout(() => element.focus(), 100);
      }
    }
  }, [hasAttemptedSubmit, tabErrors]);

  // Determine current mode based on form data
  const mode: "disable" | "single" | "multiple" = 
    formData.allowQuantity === false ? "disable" :
    formData.allowMultipleQuantities ? "multiple" : "single";

  const maxQuantity = formData.maxQuantityPerInquiry ?? 1;

  // Handle radio button mode changes with proper validation
  const handleModeChange = (newMode: "disable" | "single" | "multiple") => {
    if (newMode === "disable") {
      handleInputChange('allowQuantity', false);
      handleInputChange('allowMultipleQuantities', false);
      handleInputChange('maxQuantityPerInquiry', 1);
    } else if (newMode === "single") {
      handleInputChange('allowQuantity', true);
      handleInputChange('allowMultipleQuantities', false);
      handleInputChange('maxQuantityPerInquiry', 1);
    } else if (newMode === "multiple") {
      handleInputChange('allowQuantity', true);
      handleInputChange('allowMultipleQuantities', true);
      const newMaxQuantity = Math.max(2, formData.maxQuantityPerInquiry || 2);
      handleInputChange('maxQuantityPerInquiry', newMaxQuantity);
    }
  };

  // Handle number input changes
  const handleMaxQuantityChange = (value: number) => {
    handleInputChange('maxQuantityPerInquiry', value);
  };

  // Handle blur to enforce constraints
  const handleMaxQuantityBlur = () => {
    let safeValue = formData.maxQuantityPerInquiry;

    if (mode === "multiple") {
      if (!safeValue || safeValue < 2) safeValue = 2;
      if (safeValue > PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX) {
        safeValue = PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX;
      }
    } else {
      safeValue = Math.max(1, safeValue || 1);
    }

    if (safeValue !== formData.maxQuantityPerInquiry) {
      handleInputChange('maxQuantityPerInquiry', safeValue);
    }
  };

  // Frontend validation for configuration consistency
  const getConfigValidation = () => {
    const errors: string[] = [];
    
    if (mode === "single" && maxQuantity > 1) {
      errors.push("Single item restriction is enabled but max quantity per inquiry is greater than 1.");
    }
    if (mode === "multiple" && maxQuantity < 2) {
      errors.push("Maximum quantity for multiple mode must be at least 2.");
    }
    if (mode === "disable" && maxQuantity !== 1) {
      errors.push("When quantity is disabled, max quantity should be 1.");
    }
    
    return { errors };
  };

  const configValidation = getConfigValidation();
  const hasConfigurationErrors = configValidation.errors.length > 0;

  // Enhanced styling with theme integration
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const radioGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: theme.colors.surface,
    borderRadius: '12px',
    border: `1px solid ${hasFieldError('allowQuantity', allErrors) || hasFieldError('allowMultipleQuantities', allErrors) ? theme.colors.error : theme.colors.border}`,
    boxShadow: hasFieldError('allowQuantity', allErrors) || hasFieldError('allowMultipleQuantities', allErrors) ? 
      `0 0 0 3px ${theme.colors.error}15` : 'none',
    animation: hasAttemptedSubmit && (hasFieldError('allowQuantity', allErrors) || hasFieldError('allowMultipleQuantities', allErrors)) ? 'shake 0.5s ease-in-out' : 'none',
  };

  const radioItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  };

  const radioInputStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: theme.colors.primary,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: theme.colors.text,
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: '500',
  };

  const titleStyle = (hasError: boolean): React.CSSProperties => ({
    fontSize: '1.125rem',
    fontWeight: '600',
    color: hasError ? theme.colors.error : theme.colors.text,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s ease',
  });

  const numberInputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '120px',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    border: `2px solid ${hasError ? theme.colors.error : theme.colors.border}`,
    borderRadius: '8px',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: hasError ? `0 0 0 3px ${theme.colors.error}15` : 'none',
  });

  const summaryBoxStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '1rem',
  };

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: `${theme.colors.info}08`,
    border: `1px solid ${theme.colors.info}30`,
    borderRadius: '12px',
    padding: '1rem',
  };

  const warningBoxStyle: React.CSSProperties = {
    backgroundColor: `${theme.colors.warning}08`,
    border: `1px solid ${theme.colors.warning}30`,
    borderRadius: '12px',
    padding: '1rem',
  };

  const successBoxStyle: React.CSSProperties = {
    backgroundColor: `${theme.colors.success}08`,
    border: `1px solid ${theme.colors.success}30`,
    borderRadius: '12px',
    padding: '1rem',
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: theme.colors.error,
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  // Animation keyframes
  const keyframes = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        {/* Mode Selection */}
        <div style={sectionStyle}>
          <h3 style={titleStyle(hasFieldError('allowQuantity', allErrors) || hasFieldError('allowMultipleQuantities', allErrors))}>
            Quantity Settings
            {(hasFieldError('allowQuantity', allErrors) || hasFieldError('allowMultipleQuantities', allErrors)) && (
              <FiAlertTriangle size={20} />
            )}
          </h3>
          
          <div style={radioGroupStyle}>
            <label 
              style={radioItemStyle}
              onMouseEnter={(e) => {
                if (mode !== "disable") {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}08`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="radio"
                name="quantityMode"
                value="disable"
                checked={mode === "disable"}
                onChange={() => handleModeChange("disable")}
                style={radioInputStyle}
              />
              <span style={labelStyle}>Disable quantity selection</span>
            </label>

            <label 
              style={radioItemStyle}
              onMouseEnter={(e) => {
                if (mode !== "single") {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}08`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="radio"
                name="quantityMode"
                value="single"
                checked={mode === "single"}
                onChange={() => handleModeChange("single")}
                style={radioInputStyle}
              />
              <span style={labelStyle}>Restrict to single item per inquiry</span>
            </label>

            <label 
              style={radioItemStyle}
              onMouseEnter={(e) => {
                if (mode !== "multiple") {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}08`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="radio"
                name="quantityMode"
                value="multiple"
                checked={mode === "multiple"}
                onChange={() => handleModeChange("multiple")}
                style={radioInputStyle}
              />
              <span style={labelStyle}>Allow multiple items per inquiry</span>
            </label>
          </div>

          {/* Display field errors */}
          {getFieldErrors('allowQuantity', allErrors).map((error, index) => (
            <div key={`allowQuantity-${index}`} style={errorTextStyle}>
              <FiAlertTriangle size={12} />
              {error}
            </div>
          ))}
          {getFieldErrors('allowMultipleQuantities', allErrors).map((error, index) => (
            <div key={`allowMultipleQuantities-${index}`} style={errorTextStyle}>
              <FiAlertTriangle size={12} />
              {error}
            </div>
          ))}
        </div>

        {/* Max Quantity Input for Multiple Mode */}
        {mode === "multiple" && (
          <div style={{ paddingLeft: '1.5rem' }}>
            <div style={sectionStyle}>
              <label style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: hasFieldError('maxQuantityPerInquiry', allErrors) ? theme.colors.error : theme.colors.text,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                Maximum quantity per inquiry
                {hasFieldError('maxQuantityPerInquiry', allErrors) && <FiAlertTriangle size={16} />}
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  name="maxQuantityPerInquiry"
                  type="number"
                  value={maxQuantity}
                  onChange={(e) => handleMaxQuantityChange(parseInt(e.target.value) || 0)}
                  onBlur={handleMaxQuantityBlur}
                  min={2}
                  max={PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX}
                  style={numberInputStyle(hasFieldError('maxQuantityPerInquiry', allErrors))}
                  onFocus={(e) => {
                    if (!hasFieldError('maxQuantityPerInquiry', allErrors)) {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
                    }
                  }}
                />
                
                <div style={{
                  fontSize: '0.8rem',
                  color: theme.colors.textSecondary,
                  fontStyle: 'italic',
                }}>
                  Set the maximum number of items a customer can request in a single inquiry (2-{PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX})
                </div>

                {/* Display max quantity field errors */}
                {getFieldErrors('maxQuantityPerInquiry', allErrors).map((error, index) => (
                  <div key={index} style={errorTextStyle}>
                    <FiAlertTriangle size={12} />
                    {error}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Configuration Summary */}
        <div style={summaryBoxStyle}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <FiInfo size={16} />
            Current Configuration
          </h4>
          <div style={{
            fontSize: '0.85rem',
            color: theme.colors.textSecondary,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: theme.colors.text }}>Mode:</strong> {
                mode === "disable" ? "Quantity Disabled" : 
                mode === "single" ? "Single Item Only" : 
                "Multiple Items Allowed"
              }
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: theme.colors.text }}>Allow Quantity:</strong> {formData.allowQuantity ? "Yes" : "No"}
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: theme.colors.text }}>Allow Multiple Quantities:</strong> {formData.allowMultipleQuantities ? "Yes" : "No"}
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: theme.colors.text }}>Max Quantity:</strong> {maxQuantity}
            </p>
          </div>
        </div>

        {/* Configuration Status */}
        {!hasConfigurationErrors && !tabErrors.length ? (
          <div style={successBoxStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}>
              <FiCheckCircle size={16} color={theme.colors.success} />
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: theme.colors.success,
                margin: 0,
              }}>
                Configuration Valid
              </h4>
            </div>
            <p style={{
              fontSize: '0.85rem',
              color: theme.colors.success,
              margin: 0,
            }}>
              Your quantity settings are properly configured and ready to use.
            </p>
          </div>
        ) : null}

        {/* Auto-Correction Notice */}
        <div style={infoBoxStyle}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            <FiInfo size={16} color={theme.colors.info} />
            <h4 style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: theme.colors.info,
              margin: 0,
            }}>
              Auto-Correction Notice
            </h4>
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: theme.colors.info,
            marginBottom: '0.5rem',
          }}>
            The system will automatically enforce valid combinations:
          </p>
          <ul style={{
            fontSize: '0.85rem',
            color: theme.colors.info,
            margin: 0,
            paddingLeft: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}>
            <li>If quantity is disabled, customer won't see quantity input</li>
            <li>If restricted to single item, max quantity will be set to 1</li>
            <li>If multiple items allowed, max quantity will be at least 2</li>
            <li>Max quantity is always kept within valid limits (1-{PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX})</li>
          </ul>
        </div>

        {/* Configuration Errors */}
        {hasConfigurationErrors && (
          <div style={warningBoxStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}>
              <FiAlertTriangle size={16} color={theme.colors.warning} />
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: theme.colors.warning,
                margin: 0,
              }}>
                Configuration Issues
              </h4>
            </div>
            <ul style={{
              fontSize: '0.85rem',
              color: theme.colors.warning,
              margin: 0,
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}>
              {configValidation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Display consolidated errors for this tab */}
        {hasAttemptedSubmit && <ErrorDisplay errors={tabErrors} />}
      </div>
    </>
  );
};

export default QuantityTab;