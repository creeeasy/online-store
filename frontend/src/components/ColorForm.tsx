// components/ColorForm.tsx
import React, { useState, useRef } from 'react';
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
    if (!isValidHex(hexCode)) return 'Invalid hex color code';
    const duplicate = colors.find(
      (color, i) => i !== index && color.hexCode.toLowerCase() === hexCode.toLowerCase()
    );
    if (duplicate) return 'Hex code must be unique';
    return '';
  };

  const handlePaletteSelect = (color: IProductColor) => {
    if (colors.length >= maxColors) return;
    const newColor: IProductColor = { ...color };
    onChange([...colors, newColor]);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.lg,
  };

  const colorItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.sm,
    transition: 'all 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: '0.9rem',
  };

  const colorPreviewStyle = (hexCode: string): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: theme.borderRadius.md,
    border: `2px solid ${theme.colors.border}`,
    backgroundColor: hexCode,
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  });

  const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    border: 'none',
    borderRadius: theme.borderRadius.lg,
    cursor: colors.length >= maxColors ? 'not-allowed' : 'pointer',
    opacity: colors.length >= maxColors ? 0.6 : 1,
    fontSize: '0.9rem',
    fontWeight: theme.fonts.medium,
    transition: 'all 0.2s ease',
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  };

  const errorTextStyle: React.CSSProperties = {
    color: theme.colors.error,
    fontSize: '0.8rem',
    marginTop: '2px',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <h3 style={{ margin: 0, color: theme.colors.text, fontSize: '1.1rem' }}>
          Product Colors
        </h3>
        <p style={{ margin: 0, color: theme.colors.textMuted, fontSize: '0.9rem' }}>
          Add up to {maxColors} colors. Each color must have a unique name and hex code.
        </p>
      </div>

      {colors.map((color, index) => {
        const nameError = getColorNameError(color.name, index);
        const hexError = getHexCodeError(color.hexCode, index);

        return (
          <div key={index} style={colorItemStyle}>
            {/* Color preview + picker */}
            <div
              style={colorPreviewStyle(color.hexCode)}
              onClick={() => hiddenColorInputs.current[index]?.click()}
              title={`Pick a color (${color.hexCode})`}
            />
            <input
              type="color"
              ref={(el) => (hiddenColorInputs.current[index] = el)}
              value={color.hexCode}
              onChange={(e) => updateColor(index, { hexCode: e.target.value.toUpperCase() })}
              style={{ display: 'none' }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                type="text"
                placeholder="Color name (e.g., Red, Navy Blue)"
                value={color.name}
                onChange={(e) => updateColor(index, { name: e.target.value })}
                style={{
                  ...inputStyle,
                  borderColor: nameError ? theme.colors.error : theme.colors.border,
                  marginBottom: theme.spacing.xs,
                }}
                maxLength={30}
              />
              {nameError && <div style={errorTextStyle}>{nameError}</div>}

              <input
                type="text"
                placeholder="#FF0000"
                value={color.hexCode}
                onChange={(e) => updateColor(index, { hexCode: e.target.value.toUpperCase() })}
                style={{
                  ...inputStyle,
                  borderColor: hexError ? theme.colors.error : theme.colors.border,
                  fontFamily: 'monospace',
                }}
              />
              {hexError && <div style={errorTextStyle}>{hexError}</div>}
            </div>

            {showAvailability && (
              <button
                type="button"
                onClick={() => toggleAvailability(index)}
                style={actionButtonStyle}
                title={color.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
              >
                {color.isAvailable ? <FiEye size={16} /> : <FiEyeOff size={16} />}
              </button>
            )}

            <button
              type="button"
              onClick={() => removeColor(index)}
              style={actionButtonStyle}
              title="Remove color"
            >
              <FiTrash2 size={16} />
            </button>
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
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (colors.length < maxColors) {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <FiPlus size={16} />
          Add Color
        </button>
      )}

      {colors.length > 0 && (
        <div style={{ marginTop: theme.spacing.lg }}>
          <h4 style={{ margin: 0, color: theme.colors.text, fontSize: '1rem' }}>
            Quick Color Palettes
          </h4>
          <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap', marginTop: theme.spacing.sm }}>
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
        </div>
      )}
    </div>
  );
};

export default ColorForm;
