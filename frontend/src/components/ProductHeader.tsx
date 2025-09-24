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

  return (
    <div className="space-y-4 mb-8">
      <h1 
        className="text-4xl font-bold leading-tight" 
        style={{ color: theme.colors.text, fontFamily: theme.fonts.family.heading }}
      >
        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold" style={{ color: productColors.primary }}>
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-lg line-through text-gray-400">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
