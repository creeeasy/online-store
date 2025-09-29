import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import InquiryActions from './InquiryActions';
import type { OrderInquiry } from '../types/orderInquiry';
import { useDeleteConfirmation, useDeleteOrderInquiry } from '../hooks/useOrderInquiry';

const InquiryUtils = {
  formatPrice: (price?: number) => {
    if (!price) return '0 DZD';
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
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
  },

  getCustomerName: (customerData: any) => {
    if (!customerData || typeof customerData !== 'object') return 'N/A';
    
    // Look for common name fields
    const nameFields = ['fullName', 'name', 'Name', 'full_name', 'firstName', 'lastName', 'customer_name'];
    
    for (const field of nameFields) {
      if (customerData[field] && String(customerData[field]).trim()) {
        return String(customerData[field]);
      }
    }
    
    // Try to combine firstName and lastName if they exist
    const firstName = customerData['firstName'] || customerData['first_name'] || '';
    const lastName = customerData['lastName'] || customerData['last_name'] || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return 'N/A';
  },

  getWilaya: (customerData: any) => {
    if (!customerData || typeof customerData !== 'object') return 'N/A';
    
    const wilayaFields = ['wilaya', 'Wilaya', 'WILAYA', 'state', 'State', 'province', 'Province'];
    
    for (const field of wilayaFields) {
      if (customerData[field] && String(customerData[field]).trim()) {
        return String(customerData[field]);
      }
    }
    
    return 'N/A';
  },

  getPhoneNumber: (customerData: any) => {
    if (!customerData || typeof customerData !== 'object') return 'N/A';
    
    const phoneFields = ['phone', 'phoneNumber', 'phone_number', 'mobile', 'telephone', 'contact'];
    
    for (const field of phoneFields) {
      if (customerData[field] && String(customerData[field]).trim()) {
        return String(customerData[field]);
      }
    }
    
    return 'N/A';
  },

  // FIXED: Use the correct properties from OrderInquiry interface
  getOrderType: (inquiry: OrderInquiry) => {
    // Use the typeOfOrder property that exists in your interface
    return inquiry.typeOfOrder || 'quantity'; // Default to 'quantity' if undefined
  },
    getQuantity: (inquiry: OrderInquiry) => {

    return (inquiry.typeOfOrder == "quantity" && inquiry.quantity) ? inquiry.quantity : 'N/A'; 
  },


  // FIXED: Use the correct properties from OrderInquiry interface
  getSelectedOffer: (inquiry: OrderInquiry) => {
    // Use offerId to get the offer ID, then you can look up the offer title
    if (inquiry.offerId) {
      return inquiry.offerId;
    }
    
    // If you have access to the offer object with title, use that
    if (inquiry.offer?.title) {
      return inquiry.offer.title;
    }
    
    return null;
  },

  // NEW: Helper method to get offer title for display
  getOfferTitle: (inquiry: OrderInquiry) => {
    if (inquiry.offer?.title) {
      return inquiry.offer.title;
    }
    
    if (inquiry.offerId) {
      return `Offer #${inquiry.offerId.slice(-4)}`; // Show last 4 chars of ID
    }
    
    return null;
  }
};

interface InquiryTableProps {
  inquiries: OrderInquiry[];
  totalCount?: number;
}

const InquiryTable: React.FC<InquiryTableProps> = ({ inquiries, totalCount }) => {
  const { theme } = useTheme();
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  console.log(inquiries)
  // Delete hooks
  const deleteInquiry = useDeleteOrderInquiry();
  const { isConfirming, confirmDelete, handleConfirm, handleCancel } = useDeleteConfirmation();

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

  // Handle single delete with confirmation
  const handleDeleteSingle = (inquiryId: string) => {
    confirmDelete(() => {
      deleteInquiry.mutate(inquiryId);
    });
  };

  // Enhanced theme-based styles
  const deleteButtonStyle: React.CSSProperties = {
    color: '#ef4444',
    backgroundColor: '#ef444410',
    border: `1px solid #ef444430`,
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

  // All existing styles from your original component
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
    overflow: 'auto',
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
    minWidth: 0,
  };

  const customerNameStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
    fontSize: theme.fonts.size.sm,
  };

  const wilayaStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
    fontSize: theme.fonts.size.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    display: 'inline-block',
  };

  const wilayaNAStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    fontSize: theme.fonts.size.sm,
  };

  const phoneStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.family.monospace,
  };

  const phoneNAStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    fontSize: theme.fonts.size.sm,
  };

  const orderTypeBadgeStyle = (type: string): React.CSSProperties => ({
    backgroundColor: type === 'offer' ? theme.colors.secondary : theme.colors.primary,
    color: type === 'offer' ? theme.colors.textOnSecondary : theme.colors.textOnPrimary,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    textTransform: 'capitalize',
    display: 'inline-block',
  });
const quantityBadgeStyle = (hasQuantity: boolean): React.CSSProperties => ({
  backgroundColor: hasQuantity ? theme.colors.warning : theme.colors.disabled,
  color: hasQuantity ? theme.colors.background : theme.colors.primary,
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  borderRadius: theme.borderRadius.full,
  fontSize: theme.fonts.size.sm,
  fontWeight: theme.fonts.weight.semiBold,
  textTransform: 'capitalize',
  display: 'inline-block',
  opacity: hasQuantity ? 1 : 0.6, // make it look disabled
  cursor: hasQuantity ? 'default' : 'not-allowed',
});


  const offerStyle: React.CSSProperties = {
    color: theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
    fontSize: theme.fonts.size.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    display: 'inline-block',
  };

  const offerEmptyStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    fontSize: theme.fonts.size.sm,
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

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.xl,
    maxWidth: '28rem',
    width: '90%',
    margin: theme.spacing.md,
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    border: 'none',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
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
          totalCount={totalCount || inquiries.length}
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
              <th scope="col" style={thStyle}>Full Name</th>
              <th scope="col" style={thStyle}>Wilaya</th>
              <th scope="col" style={thStyle}>Phone Number</th>
              <th scope="col" style={thStyle}>Order Type</th>
              <th scope="col" style={thStyle}>Quantity</th>
              <th scope="col" style={thStyle}>Selected Offer</th>
              <th scope="col" style={thStyle}>Total Price</th>
              <th scope="col" style={thStyle}>Bot Score</th>
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
                
                {/* Full Name Column */}
                <td style={tdStyle}>
                  <div style={customerInfoStyle}>
                    <div style={customerBadgeStyle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div style={customerDetailsStyle}>
                      <div style={customerNameStyle}>
                        {InquiryUtils.getCustomerName(inquiry.customerData)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Wilaya Column */}
                <td style={tdStyle}>
                  {(() => {
                    const wilaya = InquiryUtils.getWilaya(inquiry.customerData);
                    return wilaya === 'N/A' ? (
                      <span style={wilayaNAStyle}>N/A</span>
                    ) : (
                      <span style={wilayaStyle}>
                        {wilaya}
                      </span>
                    );
                  })()}
                </td>

                {/* Phone Number Column */}
                <td style={tdStyle}>
                  {(() => {
                    const phone = InquiryUtils.getPhoneNumber(inquiry.customerData);
                    return phone === 'N/A' ? (
                      <span style={phoneNAStyle}>N/A</span>
                    ) : (
                      <span style={phoneStyle}>
                        {phone}
                      </span>
                    );
                  })()}
                </td>

                {/* Order Type Column */}
                <td style={tdStyle}>
                  {(() => {
                    const orderType = InquiryUtils.getOrderType(inquiry);
                    return (
                      <span style={orderTypeBadgeStyle(orderType)}>
                        {orderType}
                      </span>
                    );
                  })()}
                </td>

                {/* Quantity Column */}
                  <td style={tdStyle}>
                    {(() => {
                      const orderType = InquiryUtils.getQuantity(inquiry); // number | 'N/A'
                      const hasQuantity = inquiry.typeOfOrder === 'quantity' && !!inquiry.quantity;

                      return (
                        <span style={quantityBadgeStyle(hasQuantity)}>
                          {orderType}
                        </span>
                      );
                    })()}
                  </td>


                {/* Selected Offer Column */}
                <td style={tdStyle}>
                  {(() => {
                    const offerTitle = InquiryUtils.getOfferTitle(inquiry);
                    return offerTitle ? (
                      <span style={offerStyle}>
                        {InquiryUtils.truncateText(offerTitle, 20)}
                      </span>
                    ) : (
                      <span style={offerEmptyStyle}>-</span>
                    );
                  })()}
                </td>

                {/* Total Price Column */}
                <td style={tdStyle}>
                  <div style={priceStyle}>
                    {InquiryUtils.formatPrice(inquiry.totalPrice)}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={priceStyle}>
                    {inquiry?.BotScore}
                  </div>
                </td>

                {/* Date Column */}
                <td style={tdStyle}>
                  <div style={dateContainerStyle}>
                    <div style={dateStyle}>{InquiryUtils.formatDate(inquiry.createdAt)}</div>
                    <div style={timeAgoStyle}>{InquiryUtils.getTimeAgo(inquiry.createdAt)}</div>
                  </div>
                </td>

                {/* Actions Column - Only Delete */}
                <td style={{ ...tdStyle, textAlign: 'center', paddingRight: theme.spacing.xl }}>
                  <button 
                    onClick={() => handleDeleteSingle(inquiry._id)}
                    disabled={deleteInquiry.isPending}
                    style={{
                      ...deleteButtonStyle,
                      opacity: deleteInquiry.isPending ? 0.5 : 1,
                      cursor: deleteInquiry.isPending ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!deleteInquiry.isPending) {
                        e.currentTarget.style.backgroundColor = '#ef4444';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = theme.shadows.md;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!deleteInquiry.isPending) {
                        e.currentTarget.style.backgroundColor = '#ef444410';
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    {deleteInquiry.isPending ? 'Deleting...' : 'Delete'}
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
          {totalCount && totalCount !== inquiries.length && (
            <span style={{ color: theme.colors.textMuted, marginLeft: theme.spacing.sm }}>
              (of {totalCount} total)
            </span>
          )}
        </div>
        {selectedInquiries.length > 0 && (
          <div style={selectedCountStyle}>
            {selectedInquiries.length} selected
          </div>
        )}
      </div>

      {/* Single Delete Confirmation Dialog */}
      {isConfirming && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={modalTitleStyle}>Confirm Deletion</h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: 'transparent',
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#ef4444',
                  color: 'white',
                }}
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryTable;