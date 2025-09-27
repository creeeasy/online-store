import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import type { Theme } from '../types/theme';

interface ProductHeaderProps {
  product: IProduct;
  productColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    colorName: string;
  };
  customTheme?: Theme;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  product, 
  productColors,
  customTheme 
}) => {
  const { theme: baseTheme } = useTheme();
   
  // Use custom theme if provided, otherwise fall back to base theme
  const theme = customTheme || baseTheme;
  const hasCustomColors = productColors && customTheme;
 console.log(productColors)
  // Format price in Algerian Dinar
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!product.discountPrice || !product.price) return 0;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  };

  const discountPercentage = getDiscountPercentage();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  // Enhanced container styles
  const containerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
    textAlign: 'right',
    direction: 'ltr',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    background: hasCustomColors 
      ? `linear-gradient(135deg, ${theme.colors.surface} 0%, ${productColors.primary}03 100%)`
      : theme.colors.surface,
    border: hasCustomColors 
      ? `1px solid ${productColors.primary}15`
      : `1px solid ${theme.colors.border}`,
    position: 'relative',
    overflow: 'hidden'
  };

  // Decorative background element for custom colors
  const decorativeBackgroundStyle: React.CSSProperties = hasCustomColors ? {
    position: 'absolute',
    top: '-50px',
    left: '-50px',
    width: '150px',
    height: '150px',
    background: `radial-gradient(circle, ${productColors.primary}08 0%, transparent 70%)`,
    borderRadius: '50%',
    zIndex: 0
  } : {};

  // Content wrapper to ensure content is above decorative elements
  const contentWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1
  };

  // Product name styles with enhanced typography
  const productNameStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['3xl'],
    fontWeight: theme.fonts.weight.bold,
    color: hasCustomColors ? productColors.colorName : theme.colors.text,
    fontFamily: theme.fonts.family.heading,
    marginBottom: theme.spacing.md,
    lineHeight: 1.2,
    textShadow: hasCustomColors ? `0 2px 4px ${productColors.primary}10` : 'none',
    background: hasCustomColors 
      ? `linear-gradient(135deg, ${productColors.primaryDark} 0%, ${productColors.primary} 100%)`
      : 'none',
    WebkitBackgroundClip: hasCustomColors ? 'text' : 'unset',
    backgroundClip: hasCustomColors ? 'text' : 'unset'
  };

  // Price container with enhanced styling
  const priceContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexDirection: 'row-reverse',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: hasCustomColors 
      ? `linear-gradient(135deg, ${productColors.primary}08 0%, ${productColors.primaryLight}05 100%)`
      : theme.colors.backgroundSecondary
  };

  // Current price styles
  const currentPriceStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['2xl'],
    fontWeight: theme.fonts.weight.bold,
    color: hasCustomColors ? productColors.colorName : theme.colors.primary,
    fontFamily: theme.fonts.family.body,
    textShadow: hasCustomColors ? `0 2px 8px ${productColors.primary}20` : 'none'
  };

  // Original price styles
  const originalPriceStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    textDecoration: 'line-through',
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.family.body,
    opacity: 0.7
  };

  // Enhanced discount badge
  const discountBadgeStyle: React.CSSProperties = {
    background: hasCustomColors 
      ? `linear-gradient(135deg, ${productColors.primary} 0%, ${productColors.primaryDark} 100%)`
      : theme.colors.gradientPrimary,
    color: 'white',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.bold,
    boxShadow: hasCustomColors 
      ? `0 4px 15px ${productColors.primary}40`
      : theme.shadows.md,
    position: 'relative',
    overflow: 'hidden',
    border: `2px solid ${hasCustomColors ? productColors.primaryLight : theme.colors.primaryLight}`,
  };



  // Enhanced divider
  const dividerStyle: React.CSSProperties = {
    height: '2px',
    background: hasCustomColors 
      ? `linear-gradient(90deg, ${productColors.primary} 0%, ${productColors.primaryLight} 50%, transparent 100%)`
      : `linear-gradient(90deg, ${theme.colors.primary} 0%, transparent 100%)`,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.full
  };

  return (
    <div style={containerStyle}>
      {/* Decorative background for custom colors */}
      {hasCustomColors && <div style={decorativeBackgroundStyle} />}
      
      <div style={contentWrapperStyle}>

        {/* Product Name */}
        <h1 style={productNameStyle}>
          {product.name}
        </h1>

        {/* Price Section */}
        <div style={priceContainerStyle}>
          {/* Current Price */}
          <span style={currentPriceStyle}>
            {formatPrice(product.discountPrice || product.price)}
          </span>

          {/* Original Price (if discounted) */}
          {hasDiscount && (
            <span style={originalPriceStyle}>
              {formatPrice(product.price)}
            </span>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div style={discountBadgeStyle}>
              <span>{discountPercentage}% خصم</span>
            </div>
          )}
        </div>

        {/* Enhanced divider */}
        <div style={dividerStyle} />
      </div>
    </div>
  );
};