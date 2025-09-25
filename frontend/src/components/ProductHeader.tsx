import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ProductHeaderProps {
  product: any;
  productColors: {
    primary: string;
    primaryDark: string;
  };
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ product, productColors }) => {
  const { theme } = useTheme();

  // Format price in Algerian Dinar
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div style={{ 
      marginBottom: theme.spacing.lg,
      textAlign: 'right', // Right alignment for Arabic
      direction: 'rtl' // Right-to-left for Arabic content
    }}>
      {/* Product Name */}
      <h1 
        style={{ 
          fontSize: theme.fonts.size['2xl'],
          fontWeight: theme.fonts.weight.bold,
          color: theme.colors.text,
          fontFamily: theme.fonts.family.heading,
          marginBottom: theme.spacing.md,
          lineHeight: 1.2
        }}
      >
        {product.name}
      </h1>

      {/* Price Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        flexDirection: 'row-reverse' // Reverse for Arabic
      }}>
        {/* Current Price */}
        <span style={{
          fontSize: theme.fonts.size.xl,
          fontWeight: theme.fonts.weight.bold,
          color: productColors.primary,
          fontFamily: theme.fonts.family.body
        }}>
          {formatPrice(product.discountPrice || product.price)}
        </span>

        {/* Original Price (if discounted) */}
        {product.discountPrice && (
          <span style={{
            fontSize: theme.fonts.size.lg,
            textDecoration: 'line-through',
            color: theme.colors.textMuted,
            fontFamily: theme.fonts.family.body
          }}>
            {formatPrice(product.price)}
          </span>
        )}

        {/* Discount Badge */}
        {product.discountPrice && (
          <span style={{
            backgroundColor: productColors.primary,
            color: 'white',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fonts.size.sm,
            fontWeight: theme.fonts.weight.semiBold
          }}>
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% خصم
          </span>
        )}
      </div>

      {/* Simple divider */}
      <div style={{
        height: '1px',
        backgroundColor: theme.colors.border,
        marginTop: theme.spacing.lg
      }} />
    </div>
  );
};