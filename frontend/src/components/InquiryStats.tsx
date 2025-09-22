import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiryStats } from '../hooks/useOrderInquiry';
import { useTheme } from '../contexts/ThemeContext';

const InquiryStats: React.FC = () => {
  const { theme } = useTheme();
  const { data: stats, isLoading, error } = useOrderInquiryStats();

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    border: `1px solid ${theme.colors.border}`,
    position: 'relative',
    overflow: 'hidden',
    transition: theme.transitions.normal,
    background: `linear-gradient(145deg, ${theme.colors.surface} 0%, ${theme.colors.surfaceAlt} 100%)`,
  };

  const cardHoverStyle: React.CSSProperties = {
    ...cardStyle,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.xl,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    fontFamily: theme.fonts.family.heading,
    margin: 0,
    letterSpacing: theme.fonts.letterSpacing.tight,
  };

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    marginRight: theme.spacing.sm,
    background: theme.colors.gradientPrimary,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const mainStatStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.gray200}`,
    transition: theme.transitions.fast,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.family.body,
    letterSpacing: theme.fonts.letterSpacing.normal,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['3xl'],
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primary,
    fontFamily: theme.fonts.family.heading,
    lineHeight: theme.fonts.lineHeight.tight,
    textShadow: '0 1px 2px rgba(30, 115, 190, 0.1)',
  };

  const recentStatsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.sm,
    borderLeft: `3px solid ${theme.colors.secondary}`,
  };

  const recentTextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.family.body,
    lineHeight: theme.fonts.lineHeight.snug,
  };

  const recentValueStyle: React.CSSProperties = {
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.secondary,
  };

  const errorStyle: React.CSSProperties = {
    color: theme.colors.error,
    backgroundColor: `${theme.colors.error}10`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.error}30`,
    fontSize: theme.fonts.size.sm,
    lineHeight: theme.fonts.lineHeight.relaxed,
  };

  const emptyStateStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    padding: theme.spacing.xl,
    fontSize: theme.fonts.size.md,
    fontStyle: 'italic',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  if (isLoading) {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h3 style={headingStyle}>Inquiries</h3>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: theme.spacing['2xl'],
          minHeight: '120px'
        }}>
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{...iconStyle, background: theme.colors.error}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h3 style={headingStyle}>Inquiries</h3>
        </div>
        <div style={errorStyle}>
          <strong>Error loading inquiries:</strong><br />
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{...iconStyle, background: theme.colors.gray400}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 style={headingStyle}>Inquiries</h3>
        </div>
        <div style={emptyStateStyle}>
          No inquiry data available at the moment
        </div>
      </div>
    );
  }

  return (
    <div 
      style={isHovered ? cardHoverStyle : cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <div style={iconStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
        </div>
        <h3 style={headingStyle}>Inquiries</h3>
      </div>
      
      <div style={contentStyle}>
        <div style={mainStatStyle}>
          <span style={labelStyle}>Total Inquiries</span>
          <span style={valueStyle}>{stats.totalInquiries.toLocaleString()}</span>
        </div>
        
        <div style={recentStatsStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.colors.secondary} strokeWidth="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          <span style={recentTextStyle}>
            <span style={recentValueStyle}>{stats.recentInquiries}</span> in the last 7 days
          </span>
        </div>
      </div>
    </div>
  );
};

export default InquiryStats;