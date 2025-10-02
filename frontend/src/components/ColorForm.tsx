import React, { useRef } from 'react';
import { FiPlus, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { IProductColor, ColorFormProps } from '../types/product';
import { DEFAULT_COLOR_PALETTES } from '../data/predefinedFields';

const ColorForm: React.FC<ColorFormProps> = ({
  colors = [],
  onChange,
  maxColors = 3,
  showAvailability = true,
  className = ''
}) => {
  const { theme } = useTheme();
  const hiddenColorInputs = useRef<(HTMLInputElement | null)[]>([]);

  const addColor = () => {
    if (colors.length >= maxColors) return;

    const newColor: IProductColor = {
      name: '',
      hexCode: '#000000',
      isAvailable: true
    };

    onChange([...colors, newColor]);
  };

  const updateColor = (index: number, updates: Partial<IProductColor>) => {
    const updatedColors = colors.map((color, i) =>
      i === index ? { ...color, ...updates } : color
    );
    onChange(updatedColors);
  };

  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    onChange(updatedColors);
  };

  const toggleAvailability = (index: number) => {
    updateColor(index, {
      isAvailable: !colors[index].isAvailable
    });
  };

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

  const isValidColorValue = (value: string): boolean => {
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
    if (!isValidColorValue(hexCode)) {
      return 'Invalid color (use hex like #FF0000 or gradient like linear-gradient(...))';
    }
    const duplicate = colors.find(
      (color, i) => i !== index && color.hexCode.toLowerCase() === hexCode.toLowerCase()
    );
    if (duplicate) return 'Color value must be unique';
    return '';
  };

  const handlePaletteSelect = (color: IProductColor) => {
    if (colors.length >= maxColors) return;
    const newColor: IProductColor = { ...color };
    onChange([...colors, newColor]);
  };

  const extractFirstColorFromGradient = (gradientStr: string): string => {
    const hexMatch = gradientStr.match(/#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}/);
    return hexMatch ? hexMatch[0] : '#000000';
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    padding: '1.5rem',
  };

  const colorItemStyle: React.CSSProperties = {
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

  const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    backgroundColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    border: 'none',
    borderRadius: '12px',
    cursor: colors.length >= maxColors ? 'not-allowed' : 'pointer',
    opacity: colors.length >= maxColors ? 0.6 : 1,
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
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

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '60px',
    resize: 'vertical',
    fontFamily: 'monospace',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, color: theme.colors.text, fontSize: '1.1rem' }}>
          Product Colors
        </h3>
        <p style={{ margin: '0.5rem 0 0 0', color: theme.colors.textMuted, fontSize: '0.9rem' }}>
          Add up to {maxColors} colors. Use hex codes (#FF0000) or CSS gradients.
        </p>
      </div>

      {colors.map((color, index) => {
        const nameError = getColorNameError(color.name, index);
        const hexError = getHexCodeError(color.hexCode, index);
        const isGradient = isValidGradient(color.hexCode);

        return (
          <div key={index} style={colorItemStyle}>
            {/* Color preview + picker */}
            <div
              style={colorPreviewStyle(color.hexCode)}
              onClick={() => {
                if (!isGradient) {
                  hiddenColorInputs.current[index]?.click();
                }
              }}
              title={isGradient ? 'Gradient preview' : `Pick a color (${color.hexCode})`}
            />
            <input
              type="color"
              ref={(el) => (hiddenColorInputs.current[index] = el)}
              value={isGradient ? extractFirstColorFromGradient(color.hexCode) : color.hexCode}
              onChange={(e) => updateColor(index, { hexCode: e.target.value.toUpperCase() })}
              style={{ display: 'none' }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                type="text"
                placeholder="Color name (e.g., Sunset Gradient, Red)"
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
                placeholder="Hex (#FF0000) or Gradient (linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%))"
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
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {showAvailability && (
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
              )}

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

      {colors.length < maxColors && (
        <button
          type="button"
          onClick={addColor}
          style={addButtonStyle}
          onMouseEnter={(e) => {
            if (colors.length < maxColors) {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (colors.length < maxColors) {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <FiPlus size={16} />
          Add Color
        </button>
      )}

      {colors.length < maxColors && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: theme.colors.text, fontSize: '1rem' }}>
            Quick Color Palettes
          </h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {DEFAULT_COLOR_PALETTES.map((palette) => (
              <div key={palette.name} style={{ display: 'flex', gap: '2px' }}>
                {palette.colors.map((defaultColor) => (
                  <button
                    key={defaultColor.hexCode}
                    type="button"
                    onClick={() => handlePaletteSelect(defaultColor)}
                    disabled={colors.length >= maxColors}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: `1px solid ${theme.colors.border}`,
                      backgroundColor: defaultColor.hexCode,
                      cursor: colors.length >= maxColors ? 'not-allowed' : 'pointer',
                      opacity: colors.length >= maxColors ? 0.5 : 1,
                    }}
                    title={`${defaultColor.name} (${defaultColor.hexCode})`}
                  />
                ))}
              </div>
            ))}
          </div>
          <p style={{ margin: '0.75rem 0 0 0', color: theme.colors.textMuted, fontSize: '0.85rem' }}>
            💡 Tip: Try gradients like <code style={{ backgroundColor: theme.colors.backgroundSecondary, padding: '2px 6px', borderRadius: '4px' }}>linear-gradient(135deg, #667eea 0%, #764ba2 100%)</code>
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorForm;