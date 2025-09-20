import React, { useState } from 'react';
//import InquiryFilters from './InquiryFilters';
import InquiryTable from './InquiryTable';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiries } from '../hooks/useOrderInquiry';
import type { OrderInquiryFilters } from '../types/orderInquiry';
import { useTheme } from '../contexts/ThemeContext';

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

  // Theme-based styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.md,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`
  };

  const innerContainerStyle: React.CSSProperties = {
    padding: theme.spacing.xl
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    margin: 0
  };

  const refreshButtonStyle = (disabled: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows.sm
  });

  const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    padding: `${theme.spacing.xl} 0`
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    padding: `${theme.spacing.xl} 0`
  };

  const emptyStateContentStyle: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.textSecondary
  };

  const emptyStateTitleStyle: React.CSSProperties = {
    marginTop: theme.spacing.sm,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text
  };

  const emptyStateDescriptionStyle: React.CSSProperties = {
    marginTop: theme.spacing.xs,
    fontSize: '0.875rem',
    color: theme.colors.textSecondary
  };

  const errorContainerStyle: React.CSSProperties = {
    backgroundColor: `${theme.colors.primary}10`,
    border: `1px solid ${theme.colors.primary}30`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg
  };

  const errorContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.md
  };

  const errorIconStyle: React.CSSProperties = {
    flexShrink: 0,
    width: '1.25rem',
    height: '1.25rem',
    color: theme.colors.primary
  };

  const errorTextStyle: React.CSSProperties = {
    flex: 1
  };

  const errorTitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.primaryDark,
    margin: 0
  };

  const errorMessageStyle: React.CSSProperties = {
    marginTop: theme.spacing.sm,
    fontSize: '0.875rem',
    color: theme.colors.primaryDark
  };

  const errorButtonStyle: React.CSSProperties = {
    marginTop: theme.spacing.md,
    backgroundColor: `${theme.colors.primary}20`,
    color: theme.colors.primaryDark,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return (
      <div style={errorContainerStyle}>
        <div style={errorContentStyle}>
          <div style={{ flexShrink: 0 }}>
            <svg style={errorIconStyle} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div style={errorTextStyle}>
            <h3 style={errorTitleStyle}>Error loading inquiries</h3>
            <p style={errorMessageStyle}>{errorMessage}</p>
            <button
              onClick={handleRefresh}
              style={errorButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.colors.primary}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.colors.primary}20`;
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Order Inquiries</h2>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={refreshButtonStyle(isLoading)}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            <svg 
              style={{
                marginLeft: '-0.25rem',
                marginRight: theme.spacing.sm,
                width: '1rem',
                height: '1rem',
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      
         
     {//  <InquiryFilters filters={filters} onChange={handleFilterChange} />
        }
        {isLoading ? (
          <div style={loadingContainerStyle}>
            <LoadingSpinner size="lg" />
          </div>
        ) : data ? (
          <>
            <InquiryTable inquiries={data.inquiries} />
            {data.pagination && (
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div style={emptyStateStyle}>
            <div style={emptyStateContentStyle}>
              <svg 
                style={{
                  margin: '0 auto',
                  width: '3rem',
                  height: '3rem',
                  color: theme.colors.textMuted
                }}
                stroke="currentColor" 
                fill="none" 
                viewBox="0 0 48 48"
              >
                <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 style={emptyStateTitleStyle}>No inquiries found</h3>
              <p style={emptyStateDescriptionStyle}>
                {Object.keys(filters).length > 2 ? 'Try adjusting your filters.' : 'No inquiries have been submitted yet.'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default InquiryList;