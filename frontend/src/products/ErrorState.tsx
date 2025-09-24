// components/ErrorState.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { ApiError } from '../utils/apiClient';

interface ErrorStateProps {
  error?: ApiError;
  productColors: {
    primary: string;
    primaryDark: string;
  };
  onGoBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  productColors, 
  onGoBack 
}) => {
  const { theme } = useTheme();

  return (
    <div 
      style={{
        background: theme.colors.background,
        minHeight: '100vh'
      }}
      className="flex items-center justify-center"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-md mx-auto">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: theme.colors.error + '20' }}
          >
            <svg 
              className="w-12 h-12" 
              fill="none" 
              stroke={theme.colors.error} 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.005-5.5-2.5" />
            </svg>
          </div>
          <h2 
            className="text-3xl font-bold mb-4"
            style={{ color: theme.colors.text }}
          >
            Product Not Found
          </h2>
          <p 
            className="mb-8"
            style={{ color: theme.colors.textSecondary }}
          >
            {error?.message || "Sorry, we couldn't find the product you're looking for."}
          </p>
          <button 
            onClick={onGoBack}
            className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: productColors.primary,
              color: theme.colors.textOnPrimary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = productColors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = productColors.primary;
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};