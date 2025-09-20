import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Theme-based styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm
  };

  const navigationButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const pageButtonStyle = (isActive: boolean): React.CSSProperties => ({
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
    color: isActive ? theme.colors.secondary : theme.colors.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium
  });

  const pageInfoStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    marginLeft: theme.spacing.sm
  };

  return (
    <div style={{ ...containerStyle }} className={className}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={navigationButtonStyle(currentPage === 1)}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
          }
        }}
        aria-label="Previous page"
      >
        <FiChevronLeft size={20} />
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={pageButtonStyle(currentPage === page)}
          onMouseEnter={(e) => {
            if (currentPage !== page) {
              e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== page) {
              e.currentTarget.style.backgroundColor = theme.colors.surface;
            }
          }}
          aria-label={`Go to page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={navigationButtonStyle(currentPage === totalPages)}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
          }
        }}
        aria-label="Next page"
      >
        <FiChevronRight size={20} />
      </button>

      {totalPages > 5 && (
        <span style={pageInfoStyle}>
          Page {currentPage} of {totalPages}
        </span>
      )}
    </div>
  );
};

export default Pagination;