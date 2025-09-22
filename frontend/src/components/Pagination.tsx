import React from 'react';
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    if (totalPages > maxVisiblePages && currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) {
        pages.push('ellipsis-start');
      }
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the beginning
    if (currentPage <= 3) {
      startPage = 1;
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    
    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (totalPages <= maxVisiblePages || !pages.includes(1) || i !== 1) {
        pages.push(i);
      }
    }
    
    // Always show last page
    if (totalPages > maxVisiblePages && currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push('ellipsis-end');
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Enhanced styles using the theme system
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    fontFamily: theme.fonts.family.body,
  };

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const navigationButtonStyle = (disabled: boolean): React.CSSProperties => ({
    width: '44px',
    height: '44px',
    borderRadius: theme.borderRadius.lg,
    border: `2px solid ${disabled ? theme.colors.disabled : theme.colors.border}`,
    backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.surface,
    color: disabled ? theme.colors.textMuted : theme.colors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: theme.transitions.normal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0',
    boxShadow: disabled ? 'none' : theme.shadows.sm,
  });

  const pageButtonStyle = (isActive: boolean): React.CSSProperties => ({
    width: '44px',
    height: '44px',
    borderRadius: theme.borderRadius.lg,
    border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
    color: isActive ? theme.colors.textOnPrimary : theme.colors.text,
    cursor: 'pointer',
    transition: theme.transitions.normal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.fonts.size.sm,
    fontWeight: isActive ? theme.fonts.weight.bold : theme.fonts.weight.semiBold,
    fontFamily: theme.fonts.family.body,
    boxShadow: isActive ? theme.shadows.md : theme.shadows.sm,
    position: 'relative',
    overflow: 'hidden',
  });

  const ellipsisStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.fonts.size.sm,
  };

  const pageInfoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginLeft: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    borderLeft: `1px solid ${theme.colors.border}`,
  };

  const pageInfoStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    fontFamily: theme.fonts.family.body,
    letterSpacing: theme.fonts.letterSpacing.wide,
    textTransform: 'uppercase',
  };

  const quickJumpStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const quickJumpButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    fontSize: theme.fonts.size.xs,
    fontWeight: theme.fonts.weight.medium,
    textTransform: 'uppercase',
    letterSpacing: theme.fonts.letterSpacing.wider,
  };

  const pages = getPageNumbers();

  return (
    <div style={containerStyle} className={className}>
      <div style={wrapperStyle}>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={navigationButtonStyle(currentPage === 1)}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = theme.colors.hover;
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.transform = 'translateX(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = theme.colors.surface;
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.color = theme.colors.text;
              e.currentTarget.style.transform = 'translateX(0)';
            }
          }}
          aria-label="Previous page"
          title="Previous page"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <div key={`ellipsis-${index}`} style={ellipsisStyle}>
                <FiMoreHorizontal size={20} />
              </div>
            );
          }

          const pageNumber = page as number;
          const isActive = currentPage === pageNumber;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              style={pageButtonStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.hover;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = theme.shadows.sm;
                }
              }}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
              title={`Page ${pageNumber}`}
            >
              {/* Active page indicator */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '2px',
                    borderRadius: theme.borderRadius.md,
                    background: `linear-gradient(45deg, ${theme.colors.primaryLight}20, ${theme.colors.primary}20)`,
                    zIndex: -1,
                  }}
                />
              )}
              {pageNumber}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={navigationButtonStyle(currentPage === totalPages)}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = theme.colors.hover;
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.transform = 'translateX(2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = theme.colors.surface;
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.color = theme.colors.text;
              e.currentTarget.style.transform = 'translateX(0)';
            }
          }}
          aria-label="Next page"
          title="Next page"
        >
          <FiChevronRight size={20} />
        </button>

        {/* Page Info & Quick Navigation */}
        {totalPages > 5 && (
          <div style={pageInfoContainerStyle}>
            <div style={pageInfoStyle}>
              {currentPage} of {totalPages}
            </div>
            <div style={quickJumpStyle}>
              {currentPage > 3 && (
                <button
                  onClick={() => onPageChange(1)}
                  style={quickJumpButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                    e.currentTarget.style.color = theme.colors.textOnPrimary;
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                  title="Go to first page"
                >
                  First
                </button>
              )}
              {currentPage < totalPages - 2 && (
                <button
                  onClick={() => onPageChange(totalPages)}
                  style={quickJumpButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                    e.currentTarget.style.color = theme.colors.textOnPrimary;
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                  title="Go to last page"
                >
                  Last
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced animations via CSS-in-JS */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          /* Smooth transitions for all interactive elements */
          button {
            transition: all ${theme.transitions.normal} !important;
          }

          /* Focus styles for accessibility */
          button:focus-visible {
            outline: 2px solid ${theme.colors.primary};
            outline-offset: 2px;
          }
        `}
      </style>
    </div>
  );
};

export default Pagination;