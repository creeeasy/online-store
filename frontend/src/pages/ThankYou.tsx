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
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.background} 50%, ${theme.colors.primaryLight}15 100%)`,
    padding: theme.spacing.xl,
    fontFamily: theme.fonts.family.body,
    position: 'relative',
    overflow: 'hidden',
    direction: 'rtl', // Arabic text direction
  };

  const backgroundShapesStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    background: `
      radial-gradient(circle at 20% 80%, ${theme.colors.primary} 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, ${theme.colors.secondary} 0%, transparent 60%),
      radial-gradient(circle at 40% 40%, ${theme.colors.primaryLight} 0%, transparent 50%),
      radial-gradient(circle at 60% 70%, ${theme.colors.secondaryLight} 0%, transparent 45%)
    `,
  };

  const floatingElementsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    right: '15%',
    width: '100px',
    height: '100px',
    background: `linear-gradient(45deg, ${theme.colors.primaryLight}20, ${theme.colors.secondary}15)`,
    borderRadius: theme.borderRadius.full,
    animation: 'float 6s ease-in-out infinite',
  };

  const floatingElements2Style: React.CSSProperties = {
    position: 'absolute',
    bottom: '15%',
    left: '10%',
    width: '60px',
    height: '60px',
    background: `linear-gradient(45deg, ${theme.colors.secondary}25, ${theme.colors.primaryLight}20)`,
    borderRadius: theme.borderRadius.full,
    animation: 'float 8s ease-in-out infinite reverse',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `${theme.shadows.xl}, 0 0 40px ${theme.colors.primary}08`,
    padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']}`,
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
    border: `1px solid ${theme.colors.border}`,
    position: 'relative',
    zIndex: theme.zIndex.base,
    backdropFilter: 'blur(15px)',
    background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.surfaceAlt} 100%)`,
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.primary} 100%)`,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing.xl,
    boxShadow: `0 8px 32px ${theme.colors.primary}40`,
    position: 'relative',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    color: theme.colors.white,
    fontWeight: theme.fonts.weight.bold,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['4xl'],
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.fonts.family.heading,
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: `0 2px 4px ${theme.colors.shadow}`,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
    marginBottom: theme.spacing['2xl'],
    fontWeight: theme.fonts.weight.medium,
  };

  const subMessageStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xl,
    lineHeight: theme.fonts.lineHeight.normal,
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
    color: theme.colors.textOnPrimary,
    fontFamily: theme.fonts.family.body,
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semiBold,
    borderRadius: theme.borderRadius.xl,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: theme.transitions.normal,
    boxShadow: `0 8px 25px ${theme.colors.primary}40`,
    minWidth: '200px',
    position: 'relative',
    overflow: 'hidden',
  };

  const buttonHoverStyle = {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: `0 12px 35px ${theme.colors.primary}50`,
  };

  // Add keyframe animations via a style tag
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    
    @keyframes sparkle {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={containerStyle}>
        {/* Background Shapes */}
        <div style={backgroundShapesStyle}></div>
        
        {/* Floating Elements */}
        <div style={floatingElementsStyle}></div>
        <div style={floatingElements2Style}></div>
        
        {/* Main Card */}
        <div style={cardStyle}>
          {/* Icon Circle */}
          <div style={iconContainerStyle}>
            <span style={iconStyle}>✓</span>
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '20px',
              height: '20px',
              background: theme.colors.secondary,
              borderRadius: theme.borderRadius.full,
              animation: 'sparkle 2s ease-in-out infinite',
            }}></div>
          </div>
          
          {/* Content */}
          <h1 style={titleStyle}>شكراً لك!</h1>
          <p style={messageStyle}>
            تم إرسال استفسارك بنجاح
          </p>
          <p style={subMessageStyle}>
            سنتواصل معك خلال 24 ساعة
          </p>
          
          {/* Action Button */}
          <button
            style={buttonStyle}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, buttonHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}40`;
            }}
          >
            العودة للرئيسية
            <span style={{
              marginRight: theme.spacing.sm,
              transition: theme.transitions.fast,
            }}>→</span>
          </button>
          
          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            background: `linear-gradient(45deg, ${theme.colors.primaryLight}30, transparent)`,
            borderRadius: theme.borderRadius.full,
            animation: 'pulse 3s ease-in-out infinite',
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '30px',
            height: '30px',
            background: `linear-gradient(45deg, ${theme.colors.secondary}25, transparent)`,
            borderRadius: theme.borderRadius.full,
            animation: 'pulse 4s ease-in-out infinite',
          }}></div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;