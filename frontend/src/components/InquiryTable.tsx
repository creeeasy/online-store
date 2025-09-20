import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import StatusBadge from './StatusBadge';
import InquiryActions from './InquiryActions';
import type { OrderInquiry } from '../types/orderInquiry';

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

  // Theme-based styles
  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: `${theme.spacing.xl} 0`,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md
  };

  const emptyIconStyle: React.CSSProperties = {
    margin: '0 auto',
    height: '3rem',
    width: '3rem',
    color: theme.colors.textMuted
  };

  const emptyTitleStyle: React.CSSProperties = {
    marginTop: theme.spacing.sm,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.text
  };

  const emptyDescriptionStyle: React.CSSProperties = {
    marginTop: theme.spacing.xs,
    fontSize: '0.875rem',
    color: theme.colors.textSecondary
  };

  const containerStyle: React.CSSProperties = {
    marginTop: theme.spacing.xl
  };

  const tableContainerStyle: React.CSSProperties = {
    overflow: 'hidden',
    boxShadow: theme.shadows.sm,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`
  };

  const tableStyle: React.CSSProperties = {
    minWidth: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary
  };

  const thStyle: React.CSSProperties = {
    padding: `${theme.spacing.md} ${theme.spacing.sm}`,
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const thCheckboxStyle: React.CSSProperties = {
    position: 'relative',
    width: '3rem',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const thActionsStyle: React.CSSProperties = {
    position: 'relative',
    padding: `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.sm}`,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const tbodyStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface
  };

  const getRowStyle = (isSelected: boolean): React.CSSProperties => ({
    backgroundColor: isSelected ? `${theme.colors.primary}10` : theme.colors.surface,
    transition: 'background-color 0.2s ease',
    borderBottom: `1px solid ${theme.colors.border}`
  });

  const tdStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    padding: `${theme.spacing.lg} ${theme.spacing.sm}`,
    fontSize: '0.875rem'
  };

  const tdCheckboxStyle: React.CSSProperties = {
    position: 'relative',
    width: '3rem',
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`
  };

  const checkboxStyle: React.CSSProperties = {
    position: 'absolute',
    left: theme.spacing.lg,
    top: '50%',
    marginTop: '-0.5rem',
    height: '1rem',
    width: '1rem',
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border}`,
    accentColor: theme.colors.primary
  };

  const customerAvatarStyle: React.CSSProperties = {
    height: '2.5rem',
    width: '2.5rem',
    flexShrink: 0,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const customerAvatarTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    color: theme.colors.primary
  };

  const customerNameStyle: React.CSSProperties = {
    fontWeight: theme.fonts.medium,
    color: theme.colors.text
  };

  const customerPhoneStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: '0.75rem'
  };

  const customerRefStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    fontSize: '0.75rem'
  };

  const productImageStyle: React.CSSProperties = {
    height: '2rem',
    width: '2rem',
    flexShrink: 0,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    objectFit: 'cover'
  };

  const productNameStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.medium
  };

  const variantStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary
  };

  const quantityStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.medium
  };

  const priceStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.semiBold
  };

  const dateStyle: React.CSSProperties = {
    color: theme.colors.text
  };

  const timeAgoStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textMuted
  };

  const viewButtonStyle: React.CSSProperties = {
    color: theme.colors.primary,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    transition: 'color 0.2s ease'
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderTop: `1px solid ${theme.colors.border}`,
    fontSize: '0.875rem',
    color: theme.colors.text
  };

  const selectedCountStyle: React.CSSProperties = {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary
  };

  if (inquiries.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <svg style={emptyIconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 style={emptyTitleStyle}>No inquiries found</h3>
        <p style={emptyDescriptionStyle}>No inquiries match your current filters.</p>
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
              <th scope="col" style={thStyle}>
                Customer
              </th>
              <th scope="col" style={thStyle}>
                Product
              </th>
              <th scope="col" style={thStyle}>
                Quantity
              </th>
              <th scope="col" style={thStyle}>
                Total
              </th>
              <th scope="col" style={thStyle}>
                Status
              </th>
              <th scope="col" style={thStyle}>
                Date
              </th>
              <th scope="col" style={thActionsStyle}>
                <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody style={tbodyStyle}>
            {inquiries.map((inquiry) => (
              <tr 
                key={inquiry._id} 
                style={getRowStyle(selectedInquiries.includes(inquiry._id))}
                onMouseEnter={(e) => {
                  if (!selectedInquiries.includes(inquiry._id)) {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedInquiries.includes(inquiry._id)) {
                    e.currentTarget.style.backgroundColor = theme.colors.surface;
                  }
                }}
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
                <td style={{ ...tdStyle, paddingLeft: theme.spacing.lg, paddingRight: theme.spacing.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={customerAvatarStyle}>
                      <span style={customerAvatarTextStyle}>
                        {inquiry.customerData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div style={{ marginLeft: theme.spacing.lg }}>
                      <div style={customerNameStyle} title={inquiry.customerData.name}>
                        {InquiryUtils.truncateText(inquiry.customerData.name, 20)}
                      </div>
                      <div style={customerPhoneStyle}>{inquiry.customerData.phone}</div>
                      {inquiry.customerData.reference && (
                        <div style={customerRefStyle}>
                          Ref: {inquiry.customerData.reference}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Product Column */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {inquiry.product?.images?.[0] && (
                      <img 
                        src={inquiry.product.images[0]} 
                        alt={inquiry.productName}
                        style={productImageStyle}
                      />
                    )}
                    <div>
                      <div style={productNameStyle} title={inquiry.productName}>
                        {InquiryUtils.truncateText(inquiry.productName, 25)}
                      </div>
                      {inquiry.selectedVariants && Object.keys(inquiry.selectedVariants).length > 0 && (
                        <div style={variantStyle}>
                          {Object.entries(inquiry.selectedVariants).map(([key, value]) => (
                            <span key={key} style={{ marginRight: theme.spacing.sm }}>
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Quantity Column */}
                <td style={{ ...tdStyle, ...quantityStyle }}>
                  {inquiry.quantity || 1}
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
                  <div style={dateStyle}>{InquiryUtils.formatDate(inquiry.createdAt)}</div>
                  <div style={timeAgoStyle}>
                    {InquiryUtils.getTimeAgo(inquiry.createdAt)}
                  </div>
                </td>

                {/* Actions Column */}
                <td style={{ ...tdStyle, paddingLeft: theme.spacing.sm, paddingRight: theme.spacing.lg, textAlign: 'right', fontWeight: theme.fonts.medium }}>
                  <button 
                    onClick={() => handleViewInquiry(inquiry)}
                    style={viewButtonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.colors.primaryDark;
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.colors.primary;
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    View
                    <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                      , {inquiry.customerData.name}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div style={footerStyle}>
        Showing {inquiries.length} inquiries
        {selectedInquiries.length > 0 && (
          <span style={selectedCountStyle}>
            ({selectedInquiries.length} selected)
          </span>
        )}
      </div>
    </div>
  );
};

export default InquiryTable;