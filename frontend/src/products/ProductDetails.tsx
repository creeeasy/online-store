import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ProductDetailsProps {
  product: any;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: theme.spacing.lg
    }}>
      <div style={{ padding: theme.spacing.xl }}>
        {/* Section Header */}
        <h2 style={{
          fontSize: theme.fonts.size.xl,
          fontWeight: theme.fonts.weight.bold,
          color: theme.colors.text,
          fontFamily: theme.fonts.family.heading,
          marginBottom: theme.spacing.lg,
          textAlign: 'right', // Arabic alignment
          direction: 'rtl' // Right-to-left
        }}>
          تفاصيل المنتج
        </h2>
        {/* Description Content */}
        <div style={{
          color: theme.colors.textSecondary,
          lineHeight: theme.fonts.lineHeight.relaxed,
          fontSize: theme.fonts.size.md,
          textAlign: 'right', // Arabic alignment
          direction: 'rtl', // Right-to-left
          fontFamily: theme.fonts.family.body
        }}>
     
            <div dangerouslySetInnerHTML={{ 
              __html: product.description 
            }} />
          
        </div>

      </div>
    </div>
  );
};