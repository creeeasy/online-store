import React, { useState } from 'react';
import InquiryTable from './InquiryTable';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiries } from '../hooks/useOrderInquiry';
import type { OrderInquiryFilters } from '../types/orderInquiry';
import { useTheme } from '../contexts/ThemeContext';
import { FiRefreshCw, FiAlertTriangle, FiUsers } from 'react-icons/fi';

const InquiryList: React.FC = () => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState<OrderInquiryFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error, refetch } = useOrderInquiries(filters);
/*
  const handleFilterChange = (newFilters: OrderInquiryFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  */
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleRefresh = () => {
    refetch();
  };

  // Enhanced styles using the theme system
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
  };

  const innerContainerStyle: React.CSSProperties = {
    padding: theme.spacing['2xl'],
    position: 'relative',
    zIndex: 1,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
    paddingBottom: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['2xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    color: theme.colors.text,
    margin: 0,
    letterSpacing: theme.fonts.letterSpacing.tight,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
    textTransform: 'uppercase',
    letterSpacing: theme.fonts.letterSpacing.wider,
    marginTop: theme.spacing.xs,
  };

  const refreshButtonStyle = (disabled: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `2px solid ${disabled ? theme.colors.disabled : theme.colors.primary}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    color: disabled ? theme.colors.textMuted : theme.colors.primary,
    backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.surface,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: theme.transitions.normal,
    boxShadow: disabled ? 'none' : theme.shadows.sm,
    textTransform: 'uppercase',
    letterSpacing: theme.fonts.letterSpacing.wide,
  });

  const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing['3xl']} 0`,
    minHeight: '300px',
  };

  const loadingTextStyle: React.CSSProperties = {
    marginTop: theme.spacing.lg,
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    padding: `${theme.spacing['3xl']} 0`,
    minHeight: '400px',
  };

  const emptyStateContentStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '400px',
  };

  const emptyStateIconStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing.xl,
    border: `2px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md,
  };

  const emptyStateTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['2xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: theme.fonts.lineHeight.tight,
  };

  const emptyStateDescriptionStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
    marginBottom: theme.spacing.xl,
  };

  const errorContainerStyle: React.CSSProperties = {
    backgroundColor: `rgba(229, 115, 115, 0.08)`,
    border: `1px solid ${theme.colors.error}`,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing['2xl'],
    margin: theme.spacing.xl,
    animation: 'shake 0.5s ease-in-out',
  };

  const errorContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.lg,
  };

  const errorIconContainerStyle: React.CSSProperties = {
    flexShrink: 0,
    width: '48px',
    height: '48px',
    backgroundColor: `${theme.colors.error}15`,
    borderRadius: theme.borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorTextStyle: React.CSSProperties = {
    flex: 1,
  };

  const errorTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.semiBold,
    fontFamily: theme.fonts.family.heading,
    color: theme.colors.error,
    margin: 0,
    marginBottom: theme.spacing.sm,
  };

  const errorMessageStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
    marginBottom: theme.spacing.lg,
  };

  const errorButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    color: theme.colors.surface,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    border: 'none',
    cursor: 'pointer',
    transition: theme.transitions.normal,
    textTransform: 'uppercase',
    letterSpacing: theme.fonts.letterSpacing.wide,
    boxShadow: theme.shadows.md,
  };

  const decorativePatternStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    background: `radial-gradient(circle, ${theme.colors.primary}05 0%, transparent 70%)`,
    borderRadius: '50%',
    zIndex: 0,
  };

  const contentSectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    margin: `0 -${theme.spacing.xl}`,
    padding: theme.spacing.xl,
    minHeight: '200px',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  };

  const paginationContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  };

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return (
      <div style={containerStyle}>
        <div style={decorativePatternStyle} />
        <div style={errorContainerStyle}>
          <div style={errorContentStyle}>
            <div style={errorIconContainerStyle}>
              <FiAlertTriangle size={24} style={{ color: theme.colors.error }} />
            </div>
            <div style={errorTextStyle}>
              <h3 style={errorTitleStyle}>Failed to Load Inquiries</h3>
              <p style={errorMessageStyle}>
                {errorMessage}. Please check your connection and try again.
              </p>
              <button
                onClick={handleRefresh}
                style={errorButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.error;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
              >
                <FiRefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={decorativePatternStyle} />
      <div style={innerContainerStyle}>
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            <div>
              <h2 style={titleStyle}>Customer Inquiries</h2>
              <p style={subtitleStyle}>
                {data ? `${data.pagination?.totalItems || 0} Total` : 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={refreshButtonStyle(isLoading)}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.hover;
                e.currentTarget.style.borderColor = theme.colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadows.sm;
              }
            }}
          >
            <FiRefreshCw 
              size={16}
              style={{
                animation: isLoading ? 'spin 1s linear infinite' : 'none',
                transition: theme.transitions.fast
              }}
            />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div style={contentSectionStyle}>
          {isLoading ? (
            <div style={loadingContainerStyle}>
              <LoadingSpinner size="lg" />
              <p style={loadingTextStyle}>Loading inquiries...</p>
            </div>
          ) : data ? (
            <>
              <div style={tableContainerStyle}>
                <InquiryTable inquiries={data.inquiries} />
              </div>
              {data.pagination && data.pagination.totalPages > 1 && (
                <div style={paginationContainerStyle}>
                  <Pagination
                    currentPage={data.pagination.currentPage}
                    totalPages={data.pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyStateContentStyle}>
                <div style={emptyStateIconStyle}>
                  <FiUsers size={36} style={{ color: theme.colors.primary }} />
                </div>
                <h3 style={emptyStateTitleStyle}>No Inquiries Found</h3>
                <p style={emptyStateDescriptionStyle}>
                  {Object.keys(filters).length > 2 
                    ? 'Try adjusting your filters to see more results.' 
                    : 'No customer inquiries have been submitted yet. They will appear here once customers start reaching out.'
                  }
                </p>
                <button
                  onClick={handleRefresh}
                  style={{
                    ...refreshButtonStyle(false),
                    margin: '0 auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.hover;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.surface;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <FiRefreshCw size={16} />
                  Check Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default InquiryList;