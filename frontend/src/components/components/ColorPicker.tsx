// components/ColorPicker.tsx
import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import type { ColorPickerProps } from '../../types/product';
import { useTheme } from '../../contexts/ThemeContext';

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors = [],
  selectedColor,
  onColorSelect,
  showAvailabilityBadge = true,
  size = 'medium',
  className = ''
}) => {
  const { theme } = useTheme();

  const sizeMap = {
    small: { container: '32px', badge: '12px' },
    medium: { container: '48px', badge: '16px' },
    large: { container: '64px', badge: '20px' }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const colorButtonStyle = (color: any, isSelected: boolean): React.CSSProperties => ({
    width: sizeMap[size].container,
    height: sizeMap[size].container,
    borderRadius: '50%',
    border: `3px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: color.hexCode,
    cursor: color.isAvailable ? 'pointer' : 'not-allowed',
    opacity: color.isAvailable ? 1 : 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease',
    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
  });

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: sizeMap[size].badge,
    height: sizeMap[size].badge,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.6rem',
    color: theme.colors.secondary,
  };

  const availableBadgeStyle: React.CSSProperties = {
    ...badgeStyle,
    backgroundColor: theme.colors.success,
  };

  const unavailableBadgeStyle: React.CSSProperties = {
    ...badgeStyle,
    backgroundColor: theme.colors.error,
  };

  const checkmarkStyle: React.CSSProperties = {
    color: getContrastColor(color.hexCode),
    fontSize: size === 'small' ? '0.8rem' : '1rem',
  };

  function getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  if (colors.length === 0) {
    return (
      <div style={containerStyle} className={className}>
        <span style={{ color: theme.colors.textMuted, fontSize: '0.9rem' }}>
          No colors available
        </span>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      {colors.map((color) => {
        const isSelected = selectedColor === color._id || selectedColor === color.hexCode;
        const isAvailable = color.isAvailable !== false;

        return (
          <button
            key={color._id || color.hexCode}
            type="button"
            onClick={() => isAvailable && onColorSelect(color)}
            style={colorButtonStyle(color, isSelected)}
            title={`${color.name} ${isAvailable ? '(Available)' : '(Out of Stock)'}`}
            onMouseEnter={(e) => {
              if (isAvailable) {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }
            }}
            onMouseLeave={(e) => {
              if (isAvailable) {
                e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isSelected && <FiCheck style={checkmarkStyle} />}
            
            {showAvailabilityBadge && (
              <div style={isAvailable ? availableBadgeStyle : unavailableBadgeStyle}>
                {isAvailable ? <FiCheck size={8} /> : <FiX size={8} />}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ColorPicker;