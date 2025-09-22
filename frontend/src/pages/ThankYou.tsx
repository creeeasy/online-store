import React from "react";
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.background} 100%)`,
    padding: theme.spacing.xl,
    fontFamily: theme.fonts.family.body,
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundShapesStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    background: `
      radial-gradient(circle at 20% 80%, ${theme.colors.primary} 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${theme.colors.secondary} 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, ${theme.colors.primaryLight} 0%, transparent 50%)
    `,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.xl,
    padding: theme.spacing['3xl'],
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: `1px solid ${theme.colors.border}`,
    position: 'relative',
    zIndex: theme.zIndex.base,
    backdropFilter: 'blur(10px)',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing.lg,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['3xl'],
    color: theme.colors.primary,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['3xl'],
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.family.heading,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
    marginBottom: theme.spacing.xl,
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    background: theme.colors.gradientPrimary,
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.family.body,
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.semiBold,
    borderRadius: theme.borderRadius.lg,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: theme.transitions.fast,
    boxShadow: theme.shadows.md,
    minWidth: '160px',
  };

  return (
    <div style={containerStyle}>
      {/* Background Shapes */}
      <div style={backgroundShapesStyle}></div>
      
      {/* Main Card */}
      <div style={cardStyle}>
        {/* Icon Circle */}
        <div style={iconContainerStyle}>
          <span style={iconStyle}>✓</span>
        </div>
        
        {/* Content */}
        <h1 style={titleStyle}>Thank You!</h1>
        <p style={messageStyle}>
          Your inquiry has been successfully submitted.
          <br />
          We'll get back to you within 24 hours.
        </p>
        
        {/* Action Button */}
        <button
          style={buttonStyle}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = theme.shadows.lg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = theme.shadows.md;
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;