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
  setFormData,
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
    gap: theme.spacing.xl,
  };

  const headerStyle: React.CSSProperties = {
    color: theme.colors.text,
    margin: `0 0 ${theme.spacing.md} 0`,
    fontSize: '1.4rem',
    fontWeight: theme.fonts.semiBold,
  };

  const descriptionStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    margin: 0,
    fontSize: '0.95rem',
    lineHeight: 1.5,
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.primary,
    margin: `0 0 ${theme.spacing.xs} 0`,
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: theme.colors.textMuted,
    margin: 0,
  };

  const colors = formData.colors || [];
  const availableColors = colors.filter(color => color.isAvailable !== false);
  const unavailableColors = colors.filter(color => color.isAvailable === false);

  return (
    <div style={containerStyle}>
      <div>
        <h2 style={headerStyle}>Product Colors</h2>
        <p style={descriptionStyle}>
          Add and manage color variations for your product. You can specify up to 3 colors, 
          each with a unique name and hex code. Mark colors as available or unavailable based on stock.
        </p>
      </div>

      {colors.length > 0 && (
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
          backgroundColor: theme.colors.errorLight,
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
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