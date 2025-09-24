// components/LoadingState.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const LoadingState: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div style={{ background: theme.colors.background, minHeight: '100vh' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Gallery Skeleton */}
            <div className="space-y-4">
              <div 
                className="aspect-square rounded-2xl animate-pulse"
                style={{ backgroundColor: theme.colors.gray200 }}
              ></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg animate-pulse"
                    style={{ backgroundColor: theme.colors.gray200 }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-6">
              <div 
                className="h-8 rounded animate-pulse"
                style={{ backgroundColor: theme.colors.gray200 }}
              ></div>
              <div 
                className="h-6 rounded w-1/3 animate-pulse"
                style={{ backgroundColor: theme.colors.gray200 }}
              ></div>
              <div className="space-y-2">
                <div 
                  className="h-4 rounded animate-pulse"
                  style={{ backgroundColor: theme.colors.gray200 }}
                ></div>
                <div 
                  className="h-4 rounded w-3/4 animate-pulse"
                  style={{ backgroundColor: theme.colors.gray200 }}
                ></div>
              </div>
              <div 
                className="h-64 rounded-2xl animate-pulse"
                style={{ backgroundColor: theme.colors.gray200 }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};