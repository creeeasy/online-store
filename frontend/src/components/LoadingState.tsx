import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingState: React.FC = () => {
  const { theme } = useTheme();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.surface} 50%, ${theme.colors.surfaceAlt} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
    padding: theme.spacing.xl,
  };

  const spinnerContainerStyle: React.CSSProperties = {
    position: 'relative',
    marginBottom: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const spinnerStyle: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    border: `3px solid ${theme.colors.gray200}`,
    borderTop: `3px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    position: 'relative',
  };

  const innerSpinnerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '6px',
    left: '6px',
    right: '6px',
    bottom: '6px',
    border: `2px solid transparent`,
    borderTop: `2px solid ${theme.colors.secondary}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite reverse',
  };

  const textStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.medium,
    fontFamily: theme.fonts.family.body,
    marginTop: theme.spacing.md,
    letterSpacing: theme.fonts.letterSpacing.wide,
  };

  const pulseDotsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  };

  const dotStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    backgroundColor: theme.colors.primary,
    borderRadius: '50%',
    animation: 'pulse 1.4s ease-in-out infinite both',
  };

  const backgroundPatternStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    background: `radial-gradient(circle at 25% 25%, ${theme.colors.primary} 0%, transparent 50%), 
                 radial-gradient(circle at 75% 75%, ${theme.colors.secondary} 0%, transparent 50%)`,
    zIndex: 1,
  };

  // Inject keyframes for animations
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 80%, 100% { 
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% { 
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={backgroundPatternStyle}></div>
      
      <div style={contentStyle}>
        <div style={spinnerContainerStyle}>
          <div style={spinnerStyle}>
            <div style={innerSpinnerStyle}></div>
          </div>
        </div>
        
        <p style={textStyle}>Loading products...</p>
        
        <div style={pulseDotsStyle}>
          <div style={{ ...dotStyle, animationDelay: '0s' }}></div>
          <div style={{ ...dotStyle, animationDelay: '0.2s' }}></div>
          <div style={{ ...dotStyle, animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;