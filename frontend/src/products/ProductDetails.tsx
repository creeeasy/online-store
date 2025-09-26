import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import type { Theme } from '../types/theme';

interface ProductDetailsProps {
  product: IProduct;
  customTheme?: Theme;
  productColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    colorName: string;
  };
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  customTheme,
  productColors 
}) => {
  const { theme: baseTheme } = useTheme();
  
  // Use custom theme if provided, otherwise fall back to base theme
  const theme = customTheme || baseTheme;
  const hasCustomColors = productColors && customTheme;

  // Enhanced container styles with dynamic theming
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${hasCustomColors ? `${productColors.primary}20` : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    boxShadow: hasCustomColors 
      ? `0 4px 20px ${productColors.primary}10` 
      : theme.shadows.sm,
    position: 'relative'
  };

  // Decorative accent bar for custom colors
  const accentBarStyle: React.CSSProperties = hasCustomColors ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${productColors.primary} 0%, ${productColors.primaryLight} 100%)`,
    borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`
  } : {};

  // Header styles with dynamic coloring
  const headerStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: hasCustomColors ? productColors.primaryDark : theme.colors.text,
    fontFamily: theme.fonts.family.heading,
    marginBottom: theme.spacing.lg,
    textAlign: 'right',
    direction: 'rtl',
    position: 'relative',
    paddingBottom: theme.spacing.sm,
  };

  // Header underline with dynamic color
  const headerUnderlineStyle: React.CSSProperties = hasCustomColors ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '60px',
    height: '3px',
    background: `linear-gradient(90deg, ${productColors.primary} 0%, ${productColors.primaryLight} 100%)`,
    borderRadius: theme.borderRadius.full
  } : {};

  // Content styles
  const contentStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
    fontSize: theme.fonts.size.md,
    textAlign: 'right',
    direction: 'rtl',
    fontFamily: theme.fonts.family.body
  };

  // Enhanced content wrapper for better styling
  const contentWrapperStyle: React.CSSProperties = {
    padding: hasCustomColors ? `${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.lg}` : theme.spacing.xl,
    background: hasCustomColors 
      ? `linear-gradient(135deg, ${theme.colors.surface} 0%, ${productColors.primary}02 100%)`
      : 'transparent'
  };

  // Color indicator for when custom colors are used
  const ColorIndicator = () => {
    if (!hasCustomColors) return null;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.md,
        fontSize: theme.fonts.size.sm,
        color: productColors.primaryDark,
        opacity: 0.8
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: theme.borderRadius.full,
          background: `linear-gradient(45deg, ${productColors.primary}, ${productColors.primaryLight})`,
          flexShrink: 0
        }} />
        <span>مصمم بألوان {productColors.colorName}</span>
      </div>
    );
  };

  // Sanitize HTML content for safety
  const sanitizeHTML = (html: string): string => {
    // Basic HTML sanitization - in production, use a proper sanitization library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '');
  };

  // Enhanced HTML content with custom styling
  const enhancedContent = product.description ? `
    <style>
      .product-description {
        direction: rtl;
        text-align: right;
        line-height: 1.7;
      }
      .product-description h1,
      .product-description h2,
      .product-description h3,
      .product-description h4,
      .product-description h5,
      .product-description h6 {
        color: ${hasCustomColors ? productColors.primaryDark : theme.colors.text};
        font-family: ${theme.fonts.family.heading};
        margin-bottom: ${theme.spacing.md};
        margin-top: ${theme.spacing.lg};
      }
      .product-description p {
        margin-bottom: ${theme.spacing.md};
        color: ${theme.colors.textSecondary};
      }
      .product-description ul,
      .product-description ol {
        margin: ${theme.spacing.md} 0;
        padding-right: ${theme.spacing.lg};
      }
      .product-description li {
        margin-bottom: ${theme.spacing.sm};
        color: ${theme.colors.textSecondary};
      }
      .product-description a {
        color: ${hasCustomColors ? productColors.primary : theme.colors.primary};
        text-decoration: none;
        border-bottom: 1px solid ${hasCustomColors ? `${productColors.primary}40` : `${theme.colors.primary}40`};
        transition: ${theme.transitions.fast};
      }
      .product-description a:hover {
        color: ${hasCustomColors ? productColors.primaryDark : theme.colors.primaryDark};
        border-bottom-color: ${hasCustomColors ? productColors.primaryDark : theme.colors.primaryDark};
      }
      .product-description strong,
      .product-description b {
        color: ${hasCustomColors ? productColors.primaryDark : theme.colors.text};
        font-weight: ${theme.fonts.weight.semiBold};
      }
      .product-description blockquote {
        border-right: 4px solid ${hasCustomColors ? productColors.primary : theme.colors.primary};
        padding-right: ${theme.spacing.md};
        margin: ${theme.spacing.lg} 0;
        background: ${hasCustomColors ? `${productColors.primary}05` : `${theme.colors.primary}05`};
        border-radius: ${theme.borderRadius.md};
        padding: ${theme.spacing.md};
      }
    </style>
    <div class="product-description">
      ${sanitizeHTML(product.description)}
    </div>
  ` : '';

  return (
    <div style={containerStyle}>
      {/* Accent bar for custom colors */}
      {hasCustomColors && <div style={accentBarStyle} />}
      
      <div style={contentWrapperStyle}>
        {/* Color indicator */}
        <ColorIndicator />
        
        {/* Section Header */}
        <div style={{ position: 'relative' }}>
          <h2 style={headerStyle}>
            تفاصيل المنتج
          </h2>
          {hasCustomColors && <div style={headerUnderlineStyle} />}
        </div>
        
        {/* Description Content */}
        <div style={contentStyle}>
          {product.description ? (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: enhancedContent
              }} 
            />
          ) : (
            <div style={{
              textAlign: 'center',
              color: theme.colors.textMuted,
              fontStyle: 'italic',
              padding: theme.spacing.xl
            }}>
              لا توجد تفاصيل متاحة لهذا المنتج
            </div>
          )}
        </div>
      </div>
    </div>
  );
};