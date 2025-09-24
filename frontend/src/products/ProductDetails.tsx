// components/ProductDetails.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ProductDetailsProps {
  product: any;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ padding: '2rem' }}>
        <h2 
          className="text-2xl font-bold mb-4"
          style={{ 
            color: theme.colors.text,
          }}
        >
          Product Details
        </h2>
        <div 
          className="prose max-w-none"
          style={{ color: theme.colors.textSecondary }}
          dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
        />
      </div>
    </div>
  );
};