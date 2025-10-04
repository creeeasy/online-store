// components/ColorsTab.tsx
import React from 'react';
import { FiPlus, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IProductColor } from '../types/product';

interface ColorsTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
  handleInputChange: (field: keyof IProduct, value: any) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({
  formData,
  validationErrors,
  handleInputChange,
}) => {
  const { theme } = useTheme();
  const hiddenColorInputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleColorsChange = (colors: IProductColor[]) => {
    handleInputChange('colors', colors);
  };

  const colors = formData.colors || [];
  const availableColors = colors.filter(color => color.isAvailable !== false);
  const unavailableColors = colors.filter(color => color.isAvailable === false);

  const isValidHex = (hex: string): boolean =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

  const isValidGradient = (value: string): boolean => {
    const trimmed = value.trim().toLowerCase();
    return (
      trimmed.startsWith('linear-gradient(') ||
      trimmed.startsWith('radial-gradient(') ||
      trimmed.startsWith('conic-gradient(') ||
      trimmed.startsWith('repeating-linear-gradient(') ||
      trimmed.startsWith('repeating-radial-gradient(')
    );
  };

  const isValidColorValue = (value: string, index: number): boolean => {
    // Second color (index 1) must be a gradient
    if (index === 1) {
      return isValidGradient(value);
    }
    // Other colors can be hex or gradient
    return isValidHex(value) || isValidGradient(value);
  };

  const getColorNameError = (name: string, index: number): string => {
    if (!name.trim()) return 'Color name is required';
    if (name.length > 30) return 'Max 30 characters allowed';
    const duplicate = colors.find(
      (color, i) => i !== index && color.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) return 'Color name must be unique';
    return '';
  };

  const getHexCodeError = (hexCode: string, index: number): string => {
    if (!hexCode.trim()) return 'Color value is required';
    
    // Special validation for second color (Offers & Highlights)
    if (index === 1) {
      if (!isValidGradient(hexCode)) {
        return 'This color must be a linear gradient (e.g., linear-gradient(135deg, #10B981 0%, #059669 100%))';
      }
    } else {
      if (!isValidColorValue(hexCode, index)) {
        return 'Invalid color (use hex like #FF0000 or gradient like linear-gradient(...))';
      }
    }
    
    const duplicate = colors.find(
      (color, i) => i !== index && color.hexCode.toLowerCase() === hexCode.toLowerCase()
    );
    if (duplicate) return 'Color value must be unique';
    return '';
  };

  const extractFirstColorFromGradient = (gradientStr: string): string => {
    const hexMatch = gradientStr.match(/#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}/);
    return hexMatch ? hexMatch[0] : '#000000';
  };

  const addColor = () => {
    if (colors.length >= 3) return;

    const newColor: IProductColor = {
      name: '',
      hexCode: colors.length === 1 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#000000',
      isAvailable: true
    };

    handleColorsChange([...colors, newColor]);
  };

  const updateColor = (index: number, updates: Partial<IProductColor>) => {
    const updatedColors = colors.map((color, i) =>
      i === index ? { ...color, ...updates } : color
    );
    handleColorsChange(updatedColors);
  };

  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    handleColorsChange(updatedColors);
  };

  const toggleAvailability = (index: number) => {
    updateColor(index, {
      isAvailable: !colors[index].isAvailable
    });
  };

  const getUsageLabel = (index: number): { label: string; color: string } => {
    switch (index) {
      case 0:
        return { label: 'Borders & Frames', color: '#3B82F6' };
      case 1:
        return { label: 'Offers & Highlights', color: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' };
      case 2:
        return { label: 'Buttons & Titles', color: '#8B5CF6' };
      default:
        return { label: 'Extra Color', color: theme.colors.textMuted };
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  };

  const headerStyle: React.CSSProperties = {
    color: theme.colors.text,
    margin: '0 0 1rem 0',
    fontSize: '1.4rem',
    fontWeight: '600',
  };

  const descriptionStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    margin: 0,
    fontSize: '0.95rem',
    lineHeight: 1.5,
  };

  const colorsListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  };

  const colorItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  };

  const colorInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const colorSwatchStyle = (color: string): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: color,
    border: `2px solid ${theme.colors.border}`,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  });

  const colorDetailsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const colorNameStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontSize: '1rem',
    fontWeight: '600',
    margin: 0,
  };

  const colorValueStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    margin: 0,
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const usageTagStyle = (bgColor: string, textColor: string = '#ffffff'): React.CSSProperties => ({
    background: bgColor,
    color: textColor,
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textAlign: 'center',
    minWidth: '120px',
    boxShadow: `0 1px 3px ${theme.colors.shadow}`,
  });

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: '1.5rem',
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    textAlign: 'center',
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: theme.colors.primary,
    margin: '0 0 0.5rem 0',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: theme.colors.textMuted,
    margin: 0,
  };

  const formContainerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    padding: '1.5rem',
  };

  const colorFormItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: theme.colors.background,
    borderRadius: '8px',
    border: `1px solid ${theme.colors.border}`,
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: '0.9rem',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '60px',
    resize: 'vertical',
    fontFamily: 'monospace',
  };

  const colorPreviewStyle = (colorValue: string): React.CSSProperties => {
    const isGradient = isValidGradient(colorValue);
    return {
      width: '50px',
      height: '50px',
      minWidth: '50px',
      borderRadius: '8px',
      border: `2px solid ${theme.colors.border}`,
      background: colorValue,
      cursor: isGradient ? 'default' : 'pointer',
      transition: 'transform 0.2s ease',
      marginTop: '4px',
    };
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
    marginTop: '4px',
  };

  const errorTextStyle: React.CSSProperties = {
    color: theme.colors.error,
    fontSize: '0.8rem',
    marginTop: '4px',
  };

  const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    backgroundColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    border: 'none',
    borderRadius: '12px',
    cursor: colors.length >= 3 ? 'not-allowed' : 'pointer',
    opacity: colors.length >= 3 ? 0.6 : 1,
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={containerStyle}>
      <div>
        <h2 style={headerStyle}>Product Colors</h2>
        <p style={descriptionStyle}>
          Add and manage color variations for your product. You can specify up to 3 colors, 
          each with a unique name and hex code or CSS gradient. <strong>Note: The second color (Offers & Highlights) must be a linear gradient.</strong>
        </p>
      </div>

      {colors.length > 0 && (
        <>
          <div style={colorsListStyle}>
            {colors.map((color, index) => {
              const usage = getUsageLabel(index);
              return (
                <div key={index} style={colorItemStyle}>
                  <div style={colorInfoStyle}>
                    <div style={colorSwatchStyle(color.hexCode)}></div>
                    <div style={colorDetailsStyle}>
                      <div style={colorNameStyle}>{color.name}</div>
                      <div style={colorValueStyle} title={color.hexCode}>{color.hexCode}</div>
                    </div>
                  </div>
                  <div style={usageTagStyle(usage.color)}>
                    {usage.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={statsContainerStyle}>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{colors.length}</div>
              <div style={statLabelStyle}>Total Colors</div>
            </div>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{availableColors.length}</div>
              <div style={statLabelStyle}>Available</div>
            </div>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{unavailableColors.length}</div>
              <div style={statLabelStyle}>Unavailable</div>
            </div>
          </div>
        </>
      )}

      <div style={formContainerStyle}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: theme.colors.text, fontSize: '1.1rem' }}>
            Product Colors
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', color: theme.colors.textMuted, fontSize: '0.9rem' }}>
            Add up to 3 colors. First and third colors: hex codes (#FF0000) or gradients. Second color: linear gradient only.
          </p>
        </div>

        {colors.map((color, index) => {
          const nameError = getColorNameError(color.name, index);
          const hexError = getHexCodeError(color.hexCode, index);
          const isGradient = isValidGradient(color.hexCode);
          const isSecondColor = index === 1;

          return (
            <div key={index} style={colorFormItemStyle}>
              <div
                style={colorPreviewStyle(color.hexCode)}
                onClick={() => {
                  if (!isGradient && !isSecondColor) {
                    hiddenColorInputs.current[index]?.click();
                  }
                }}
                title={isGradient || isSecondColor ? 'Gradient preview' : `Pick a color (${color.hexCode})`}
              />
              {!isSecondColor && (
                <input
                  type="color"
                  ref={(el) => (hiddenColorInputs.current[index] = el)}
                  value={isGradient ? extractFirstColorFromGradient(color.hexCode) : color.hexCode}
                  onChange={(e) => updateColor(index, { hexCode: e.target.value.toUpperCase() })}
                  style={{ display: 'none' }}
                />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  placeholder={isSecondColor ? "Color name (e.g., Vibrant Offer)" : "Color name (e.g., Red, Blue)"}
                  value={color.name}
                  onChange={(e) => updateColor(index, { name: e.target.value })}
                  style={{
                    ...inputStyle,
                    borderColor: nameError ? theme.colors.error : theme.colors.border,
                    marginBottom: nameError ? '4px' : '0.75rem',
                  }}
                  maxLength={30}
                />
                {nameError && <div style={errorTextStyle}>{nameError}</div>}

                <textarea
                  placeholder={
                    isSecondColor 
                      ? "Linear gradient REQUIRED (e.g., linear-gradient(135deg, #10B981 0%, #059669 100%))"
                      : "Hex (#FF0000) or Gradient (linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%))"
                  }
                  value={color.hexCode}
                  onChange={(e) => updateColor(index, { hexCode: e.target.value })}
                  style={{
                    ...textareaStyle,
                    borderColor: hexError ? theme.colors.error : theme.colors.border,
                    marginTop: nameError ? '0.75rem' : 0,
                  }}
                  rows={2}
                />
                {hexError && <div style={errorTextStyle}>{hexError}</div>}
                {isSecondColor && !hexError && (
                  <div style={{ 
                    color: theme.colors.warning, 
                    fontSize: '0.75rem', 
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    ⚠️ This color must be a linear gradient for Offers & Highlights
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => toggleAvailability(index)}
                  style={actionButtonStyle}
                  title={color.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    e.currentTarget.style.color = color.isAvailable ? theme.colors.warning : theme.colors.success;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }}
                >
                  {color.isAvailable ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  style={actionButtonStyle}
                  title="Remove color"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
                    e.currentTarget.style.color = theme.colors.error;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {colors.length < 3 && (
          <button
            type="button"
            onClick={addColor}
            style={addButtonStyle}
            onMouseEnter={(e) => {
              if (colors.length < 3) {
                e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (colors.length < 3) {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <FiPlus size={16} />
            Add Color
          </button>
        )}
      </div>

      {validationErrors.colors && (
        <div style={{
          color: theme.colors.error,
          backgroundColor: `${theme.colors.error}15`,
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.error}`,
          fontSize: '0.9rem',
        }}>
          {validationErrors.colors.join(', ')}
        </div>
      )}
    </div>
  );
};

export default ColorsTab;