import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiryStats } from '../hooks/useOrderInquiry';
import { useTheme } from '../contexts/ThemeContext';

const InquiryStats: React.FC = () => {
  const { theme } = useTheme();
  const { data: stats, isLoading, error } = useOrderInquiryStats();

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.md,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.textSecondary,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.primaryDark,
  };

  if (isLoading) {
    return (
      <div style={cardStyle}>
        <h3 style={headingStyle}>Inquiries</h3>
        <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.md }}>
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <h3 style={headingStyle}>Inquiries</h3>
        <div style={{ color: theme.colors.primaryDark }}>
          Error loading inquiries: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={cardStyle}>
        <h3 style={headingStyle}>Inquiries</h3>
        <div style={{ color: theme.colors.textSecondary }}>No inquiries available</div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>Inquiries</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={labelStyle}>Total Inquiries</span>
        <span style={valueStyle}>{stats.totalInquiries}</span>
      </div>
      <div style={{ marginTop: theme.spacing.xs, fontSize: '0.75rem', color: theme.colors.textMuted }}>
        {stats.recentInquiries} in the last 7 days
      </div>
    </div>
  );
};

export default InquiryStats;
