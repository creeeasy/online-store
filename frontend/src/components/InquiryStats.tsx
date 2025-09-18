import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiryStats } from '../hooks/useOrderInquiry';
import { useTheme } from '../contexts/ThemeContext';
const InquiryStats: React.FC = () => {
  const { theme } = useTheme();
  const { data: stats, isLoading, error } = useOrderInquiryStats();
  const getStatusColor = (status: string): React.CSSProperties => {
    switch (status) {
      case 'pending':
        return { backgroundColor: '#FFD700' };
      case 'contacted':
        return { backgroundColor: '#1E90FF' };
      case 'converted':
        return { backgroundColor: '#32CD32' };
      case 'cancelled':
        return { backgroundColor: '#FF6347' };
      default:
        return { backgroundColor: '#A9A9A9' };
    }
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'contacted':
        return 'Contacted';
      case 'converted':
        return 'Converted';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
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
  const listTitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  };
  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing.sm} 0`,
  };
  if (isLoading) {
    return (
      <div style={cardStyle}>
        <h3 style={headingStyle}>Inquiry Statistics</h3>
        <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.md }}>
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={cardStyle}>
        <h3 style={headingStyle}>Inquiry Statistics</h3>
        <div style={{ color: theme.colors.primaryDark }}>
          Error loading statistics: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
  if (!stats) {
    return (
      <div style={cardStyle}>
        <h3 style={headingStyle}>Inquiry Statistics</h3>
        <div style={{ color: theme.colors.textSecondary }}>No statistics available</div>
      </div>
    );
  }
  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>Inquiry Statistics</h3>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={labelStyle}>Total Inquiries</span>
          <span style={valueStyle}>{stats.totalInquiries}</span>
        </div>
        <div style={{ marginTop: theme.spacing.xs, fontSize: '0.75rem', color: theme.colors.textMuted }}>
          {stats.recentInquiries} in the last 7 days
        </div>
      </div>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <h4 style={listTitleStyle}>Status Breakdown</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          {stats.statusStats.map((statusStat) => (
            <div key={statusStat._id} style={listItemStyle}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', borderRadius: '9999px', marginRight: theme.spacing.sm, ...getStatusColor(statusStat._id) }}
                ></span>
                <span style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, textTransform: 'capitalize' }}>
                  {getStatusLabel(statusStat._id)}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: theme.fonts.medium, color: theme.colors.text }}>{statusStat.count}</div>
                <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>
                  {formatPrice(statusStat.totalValue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {stats.topProducts && stats.topProducts.length > 0 && (
        <div>
          <h4 style={listTitleStyle}>Top Products</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {stats.topProducts.slice(0, 5).map((product, index) => (
              <div key={product._id} style={listItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: theme.fonts.medium, color: theme.colors.textMuted, marginRight: theme.spacing.sm }}>{index + 1}.</span>
                  <span style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }} title={product.productName}>
                    {product.productName}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: theme.fonts.medium, color: theme.colors.text }}>{product.inquiryCount}</div>
                  <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>
                    {formatPrice(product.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {stats.topProducts && stats.topProducts.length === 0 && (
        <div>
          <h4 style={listTitleStyle}>Top Products</h4>
          <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>No product inquiries yet</div>
        </div>
      )}
    </div>
  );
};
export default InquiryStats;