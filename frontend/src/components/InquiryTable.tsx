import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import StatusBadge from './StatusBadge';
import InquiryActions from './InquiryActions';
import type { OrderInquiry } from '../types/orderInquiry';
import { SERVER_URL } from '../utils/apiClient';

// Utility functions for formatting
const InquiryUtils = {
  formatPrice: (price?: number) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  formatDate: (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  },

  getTimeAgo: (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  },

  truncateText: (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};

interface InquiryTableProps {
  inquiries: OrderInquiry[];
}

const InquiryTable: React.FC<InquiryTableProps> = ({ inquiries }) => {
  const { theme } = useTheme();
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const toggleSelectInquiry = (id: string) => {
    setSelectedInquiries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map(i => i._id));
    }
  };

  const handleViewInquiry = (inquiry: OrderInquiry) => {
    // TODO: Navigate to inquiry detail page or open modal
    console.log('View inquiry:', inquiry._id);
  };

  // Enhanced theme-based styles
  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing['3xl'],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.xl,
    border: `2px dashed ${theme.colors.border}`,
    position: 'relative',
    overflow: 'hidden',
  };

  const emptyStateContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  const emptyIconStyle: React.CSSProperties = {
    margin: '0 auto',
    height: '4rem',
    width: '4rem',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.fonts.family.heading,
  };

  const emptyDescriptionStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
  };

  const containerStyle: React.CSSProperties = {
    marginTop: theme.spacing.xl
  };

  const tableContainerStyle: React.CSSProperties = {
    overflow: 'hidden',
    boxShadow: theme.shadows.lg,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
  };

  const tableStyle: React.CSSProperties = {
    minWidth: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.family.body,
  };

  const theadStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.gray100} 100%)`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const thStyle: React.CSSProperties = {
    padding: `${theme.spacing.lg} ${theme.spacing.md}`,
    textAlign: 'left',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    borderBottom: `2px solid ${theme.colors.border}`,
    fontFamily: theme.fonts.family.heading,
    letterSpacing: theme.fonts.letterSpacing.wide,
    textTransform: 'uppercase' as const,
  };

  const thCheckboxStyle: React.CSSProperties = {
    position: 'relative',
    width: '3rem',
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderBottom: `2px solid ${theme.colors.border}`,
  };

  const thActionsStyle: React.CSSProperties = {
    position: 'relative',
    padding: `${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing.md}`,
    borderBottom: `2px solid ${theme.colors.border}`,
    textAlign: 'center' as const,
  };

  const tbodyStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface
  };

  const getRowStyle = (inquiryId: string): React.CSSProperties => {
    const isSelected = selectedInquiries.includes(inquiryId);
    const isHovered = hoveredRow === inquiryId;
    
    let backgroundColor = theme.colors.surface;
    if (isSelected) {
      backgroundColor = `${theme.colors.primary}15`;
    } else if (isHovered) {
      backgroundColor = theme.colors.backgroundSecondary;
    }

    return {
      backgroundColor,
      transition: theme.transitions.fast,
      borderBottom: `1px solid ${theme.colors.border}`,
      transform: isHovered && !isSelected ? 'scale(1.001)' : 'scale(1)',
      boxShadow: isHovered ? theme.shadows.sm : 'none',
    };
  };

  const tdStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    padding: `${theme.spacing.lg} ${theme.spacing.md}`,
    fontSize: theme.fonts.size.sm,
    verticalAlign: 'middle',
  };

  const tdCheckboxStyle: React.CSSProperties = {
    position: 'relative',
    width: '3rem',
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    verticalAlign: 'middle',
  };

  const checkboxStyle: React.CSSProperties = {
    height: '1.125rem',
    width: '1.125rem',
    borderRadius: theme.borderRadius.sm,
    border: `2px solid ${theme.colors.border}`,
    accentColor: theme.colors.primary,
    cursor: 'pointer',
    transition: theme.transitions.fast,
  };

  const customerDataStyle: React.CSSProperties = {
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.md,
  };

  const customerInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const customerBadgeStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    flexShrink: 0,
    textTransform: 'uppercase',
  };

  const customerDetailsStyle: React.CSSProperties = {
    minWidth: 0, // Allow text truncation
  };

  const customerPhoneStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.family.monospace,
  };

  const productContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    minWidth: 0,
  };

  const productImageStyle: React.CSSProperties = {
    height: '2.5rem',
    width: '2.5rem',
    flexShrink: 0,
    borderRadius: theme.borderRadius.md,
    objectFit: 'cover',
    border: `2px solid ${theme.colors.border}`,
    transition: theme.transitions.fast,
  };

  const productDetailsStyle: React.CSSProperties = {
    minWidth: 0,
    flex: 1,
  };

  const productNameStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
    fontSize: theme.fonts.size.sm,
    lineHeight: theme.fonts.lineHeight.snug,
    marginBottom: theme.spacing.xs,
  };

  const variantStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textSecondary,
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  };

  const variantTagStyle: React.CSSProperties = {
    backgroundColor: theme.colors.gray100,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fonts.size.xs,
    fontWeight: theme.fonts.weight.medium,
  };

  const quantityBadgeStyle: React.CSSProperties = {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.textOnSecondary,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    minWidth: '2rem',
    textAlign: 'center',
  };

  const priceStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.monospace,
  };

  const dateContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  };

  const dateStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
    fontSize: theme.fonts.size.sm,
  };

  const timeAgoStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  };

  const actionButtonStyle: React.CSSProperties = {
    color: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
    border: `1px solid ${theme.colors.primary}30`,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    cursor: 'pointer',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    transition: theme.transitions.fast,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const footerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.gray100} 100%)`,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderTop: `1px solid ${theme.colors.border}`,
    fontSize: theme.fonts.size.sm,
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const selectedCountStyle: React.CSSProperties = {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.semiBold,
    backgroundColor: `${theme.colors.primary}15`,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.fonts.size.xs,
  };

  if (inquiries.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <div style={emptyStateContentStyle}>
          <svg style={emptyIconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 style={emptyTitleStyle}>No inquiries found</h3>
          <p style={emptyDescriptionStyle}>
            No inquiries match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {selectedInquiries.length > 0 && (
        <InquiryActions 
          selectedIds={selectedInquiries} 
          onSelectionChange={setSelectedInquiries} 
        />
      )}
      
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th scope="col" style={thCheckboxStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                  checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" style={thStyle}>Customer</th>
              <th scope="col" style={thStyle}>Product</th>
              <th scope="col" style={thStyle}>Qty</th>
              <th scope="col" style={thStyle}>Total</th>
              <th scope="col" style={thStyle}>Status</th>
              <th scope="col" style={thStyle}>Date</th>
              <th scope="col" style={thActionsStyle}>Actions</th>
            </tr>
          </thead>
          <tbody style={tbodyStyle}>
            {inquiries.map((inquiry) => (
              <tr 
                key={inquiry._id} 
                style={getRowStyle(inquiry._id)}
                onMouseEnter={() => setHoveredRow(inquiry._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={tdCheckboxStyle}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={selectedInquiries.includes(inquiry._id)}
                    onChange={() => toggleSelectInquiry(inquiry._id)}
                  />
                </td>
                
                {/* Customer Column */}
                <td style={{ ...tdStyle, ...customerDataStyle }}>
                  <div style={customerInfoStyle}>
                    <div style={customerBadgeStyle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div style={customerDetailsStyle}>
                      {inquiry.customerData && Object.keys(inquiry.customerData).length > 0 ? (
                        (() => {
                          const firstKey = Object.keys(inquiry.customerData)[0];
                          const firstValue = inquiry.customerData[firstKey];
                          return (
                            <div style={customerPhoneStyle}>
                              <strong>{firstKey}:</strong> {String(firstValue)}
                            </div>
                          );
                        })()
                      ) : (
                        <div style={customerPhoneStyle}>No customer data</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Product Column */}
                <td style={tdStyle}>
                  <div style={productContainerStyle}>
                    {inquiry.product?.images?.[0] && (
                      <img 
                        src={
                          inquiry.product.images?.[0]
                            ? `${SERVER_URL}${inquiry.product.images[0]}`
                            : 'https://picsum.photos/300/300?random=default'
                        }
                        alt={inquiry.productName}
                        style={productImageStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = theme.shadows.md;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    )}
                    <div style={productDetailsStyle}>
                      <div style={productNameStyle} title={inquiry.productName}>
                        {InquiryUtils.truncateText(inquiry.productName, 25)}
                      </div>
                      {inquiry.selectedVariants && Object.keys(inquiry.selectedVariants).length > 0 && (
                        <div style={variantStyle}>
                          {Object.entries(inquiry.selectedVariants).map(([key, value]) => (
                            <span key={key} style={variantTagStyle}>
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Quantity Column */}
                <td style={tdStyle}>
                  <span style={quantityBadgeStyle}>
                    {inquiry.quantity || 1}
                  </span>
                </td>

                {/* Total Price Column */}
                <td style={tdStyle}>
                  <div style={priceStyle}>
                    {InquiryUtils.formatPrice(inquiry.totalPrice)}
                  </div>
                </td>

                {/* Status Column */}
                <td style={tdStyle}>
                  <StatusBadge status={inquiry.status} />
                </td>

                {/* Date Column */}
                <td style={tdStyle}>
                  <div style={dateContainerStyle}>
                    <div style={dateStyle}>{InquiryUtils.formatDate(inquiry.createdAt)}</div>
                    <div style={timeAgoStyle}>{InquiryUtils.getTimeAgo(inquiry.createdAt)}</div>
                  </div>
                </td>

                {/* Actions Column */}
                <td style={{ ...tdStyle, textAlign: 'center', paddingRight: theme.spacing.xl }}>
                  <button 
                    onClick={() => handleViewInquiry(inquiry)}
                    style={actionButtonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.primary;
                      e.currentTarget.style.color = theme.colors.textOnPrimary;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = theme.shadows.md;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                      e.currentTarget.style.color = theme.colors.primary;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View
                    <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                      inquiry details
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Summary Footer */}
      <div style={footerStyle}>
        <div>
          <strong>{inquiries.length}</strong> {inquiries.length === 1 ? 'inquiry' : 'inquiries'} total
        </div>
        {selectedInquiries.length > 0 && (
          <div style={selectedCountStyle}>
            {selectedInquiries.length} selected
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryTable;