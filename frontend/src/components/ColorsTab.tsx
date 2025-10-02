// components/ColorsTab.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct, IProductColor } from '../types/product';
import ColorForm from './ColorForm';

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

  const handleColorsChange = (colors: IProductColor[]) => {
    handleInputChange('colors', colors);
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
    backgroundColor: bgColor,
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

  const colors = formData.colors || [];
  const availableColors = colors.filter(color => color.isAvailable !== false);
  const unavailableColors = colors.filter(color => color.isAvailable === false);

  const getUsageLabel = (index: number): { label: string; color: string } => {
    switch (index) {
      case 0:
        return { label: 'Borders & Frames', color: '#3B82F6' };
      case 1:
        return { label: 'Offers & Highlights', color: '#10B981' };
      case 2:
        return { label: 'Buttons & Titles', color: '#8B5CF6' };
      default:
        return { label: 'Extra Color', color: theme.colors.textMuted };
    }
  };

  return (
    <div style={containerStyle}>
      <div>
        <h2 style={headerStyle}>Product Colors</h2>
        <p style={descriptionStyle}>
          Add and manage color variations for your product. You can specify up to 3 colors, 
          each with a unique name and hex code or CSS gradient. Mark colors as available or unavailable based on stock.
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
                    <div style={colorSwatchStyle(color.hex)}></div>
                    <div style={colorDetailsStyle}>
                      <div style={colorNameStyle}>{color.name}</div>
                      <div style={colorValueStyle} title={color.hex}>{color.hex}</div>
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

      <ColorForm
        colors={colors}
        onChange={handleColorsChange}
        maxColors={3}
        showAvailability={true}
      />

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