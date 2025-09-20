import React from 'react';
import { FiEdit, FiTrash2, FiCheck, FiGift, FiCopy, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';
import { DEFAULT_BASE_URL, SERVER_URL } from '../utils/apiClient';

interface ProductCardProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
  onClone?: (product: IProduct) => void;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onClone,
  viewMode = 'grid' 
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClone?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(product);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(product);
  };

  // Theme-based styles
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
  };

  const buttonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    fontWeight: theme.fonts.medium,
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  };

  const iconButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.secondary,
    boxShadow: theme.shadows.sm,
    width: '32px',
    height: '32px',
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...iconButtonStyle,
    backgroundColor: '#fef2f2',
    color: '#ef4444',
  };

  const cloneButtonStyle: React.CSSProperties = {
    ...iconButtonStyle,
    backgroundColor: '#f0f9ff',
    color: theme.colors.accent,
  };

  if (viewMode === 'list') {
    return (
      <div 
        style={{
          ...cardStyle,
          padding: theme.spacing.md,
        }}
        onClick={handleViewDetails}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = theme.shadows.lg;
          e.currentTarget.style.transform = 'translateY(-2px)';
          
          // Show action buttons on hover
          const actionButtons = e.currentTarget.querySelector('[data-actions]') as HTMLElement;
          if (actionButtons) {
            actionButtons.style.opacity = '1';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = theme.shadows.md;
          e.currentTarget.style.transform = 'translateY(0)';
          
          // Hide action buttons on leave
          const actionButtons = e.currentTarget.querySelector('[data-actions]') as HTMLElement;
          if (actionButtons) {
            actionButtons.style.opacity = '0';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <div style={{ 
            position: 'relative', 
            width: '64px', 
            height: '64px', 
            flexShrink: 0 
          }}>
            <img
              src={
                product.images?.[0]
                  ? `${SERVER_URL}${product.images[0]}`
                  : 'https://picsum.photos/300/300?random=default'
              }


              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: theme.borderRadius.md,
              }}
            />
            {product.discountPrice && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                backgroundColor: theme.colors.primary,
                color: theme.colors.secondary,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.lg,
                fontSize: '0.75rem',
                fontWeight: theme.fonts.bold,
              }}>
                SALE
              </span>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontWeight: theme.fonts.semiBold,
              color: theme.colors.text,
              margin: 0,
              marginBottom: theme.spacing.xs,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {product.name}
            </h3>
            <p style={{
              color: theme.colors.textSecondary,
              fontSize: '0.875rem',
              margin: 0,
              marginBottom: theme.spacing.xs,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <span style={{
                fontWeight: theme.fonts.bold,
                color: product.discountPrice ? theme.colors.primary : theme.colors.text,
              }}>
                ${product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span style={{
                  color: theme.colors.textMuted,
                  textDecoration: 'line-through',
                  fontSize: '0.875rem',
                }}>
                  ${product.price}
                </span>
              )}
            </div>
          </div>
          
          <div 
            data-actions
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.sm,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <button
              onClick={handleEdit}
              style={{
                ...iconButtonStyle,
                color: theme.colors.primary,
              }}
              title="Edit product"
            >
              <FiEdit size={16} />
            </button>
            {onClone && (
              <button
                onClick={handleClone}
                style={cloneButtonStyle}
                title="Clone product"
              >
                <FiCopy size={16} />
              </button>
            )}
            <button
              onClick={handleDelete}
              style={deleteButtonStyle}
              title="Delete product"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      style={cardStyle}
      onClick={handleViewDetails}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.lg;
        e.currentTarget.style.transform = 'scale(1.02)';
        
        // Show overlay and action buttons on hover
        const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement;
        const actions = e.currentTarget.querySelector('[data-hover-actions]') as HTMLElement;
        if (overlay) overlay.style.opacity = '1';
        if (actions) actions.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.md;
        e.currentTarget.style.transform = 'scale(1)';
        
        // Hide overlay and action buttons on leave
        const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement;
        const actions = e.currentTarget.querySelector('[data-hover-actions]') as HTMLElement;
        if (overlay) overlay.style.opacity = '0';
        if (actions) actions.style.opacity = '0';
      }}
    >
      <div style={{ position: 'relative', height: '192px', overflow: 'hidden' }}>
        <img
       src={
                product.images?.[0]
                  ? `${SERVER_URL}${product.images[0]}`
                  : 'https://picsum.photos/300/300?random=default'
              }
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        
        {/* Hover overlay */}
        <div 
          data-overlay
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }} 
        />
        
        {/* Action buttons on hover */}
        <div 
          data-hover-actions
          style={{
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
            display: 'flex',
            gap: theme.spacing.sm,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <button
            onClick={handleEdit}
            style={{
              ...iconButtonStyle,
              backgroundColor: `${theme.colors.secondary}E6`,
              color: theme.colors.primary,
            }}
            title="Edit product"
          >
            <FiEdit size={16} />
          </button>
          {onClone && (
            <button
              onClick={handleClone}
              style={{
                ...iconButtonStyle,
                backgroundColor: `${theme.colors.secondary}E6`,
                color: theme.colors.accent,
              }}
              title="Clone product"
            >
              <FiCopy size={16} />
            </button>
          )}
          <button
            onClick={handleDelete}
            style={{
              ...iconButtonStyle,
              backgroundColor: `${theme.colors.secondary}E6`,
              color: '#ef4444',
            }}
            title="Delete product"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
        
        {/* Sale badge */}
        {product.discountPrice && (
          <div style={{ position: 'absolute', top: theme.spacing.sm, left: theme.spacing.sm }}>
            <span style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.secondary,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.lg,
              fontSize: '0.875rem',
              fontWeight: theme.fonts.bold,
            }}>
              SALE
            </span>
          </div>
        )}
      </div>
      
      <div style={{ padding: theme.spacing.lg }}>
        <h3 style={{
          fontWeight: theme.fonts.bold,
          color: theme.colors.text,
          fontSize: '1.125rem',
          margin: 0,
          marginBottom: theme.spacing.sm,
        }}>
          {product.name}
        </h3>
        <p style={{
          color: theme.colors.textSecondary,
          fontSize: '0.875rem',
          margin: 0,
          marginBottom: theme.spacing.md,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4',
        }}>
          {product.description}
        </p>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: theme.spacing.sm, 
          marginBottom: theme.spacing.md 
        }}>
          <span style={{
            fontWeight: theme.fonts.bold,
            fontSize: '1.25rem',
            color: product.discountPrice ? theme.colors.primary : theme.colors.text,
          }}>
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span style={{
              color: theme.colors.textMuted,
              textDecoration: 'line-through',
              fontSize: '0.875rem',
            }}>
              ${product.price}
            </span>
          )}
        </div>
        
        {/* Product features */}
        <div style={{ 
          marginBottom: theme.spacing.md,
          fontSize: '0.875rem',
          color: theme.colors.textSecondary,
        }}>
          {product.dynamicFields && product.dynamicFields.length > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.xs,
            }}>
              <FiCheck size={16} style={{ color: theme.colors.accent }} />
              <span>{product.dynamicFields.length} custom field{product.dynamicFields.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {product.predefinedFields && product.predefinedFields.filter(f => f.isActive).length > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.xs,
            }}>
              <FiCheck size={16} style={{ color: theme.colors.accent }} />
              <span>{product.predefinedFields.filter(f => f.isActive).length} predefined field{product.predefinedFields.filter(f => f.isActive).length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {product.offers && product.offers.length > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.xs,
            }}>
              <FiGift size={16} style={{ color: theme.colors.accent }} />
              <span>{product.offers.length} active offer{product.offers.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {/* Bottom action buttons */}
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            style={{
              ...secondaryButtonStyle,
              flex: 1,
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            }}
          >
            <FiEye size={16} />
            View Details
          </button>
          <button
            onClick={handleEdit}
            style={{
              ...primaryButtonStyle,
              flex: 1,
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            }}
          >
            <FiEdit size={16} />
            Edit
          </button>
        </div>

        {/* Additional action buttons row for clone and delete */}
        <div style={{ 
          display: 'flex', 
          gap: theme.spacing.sm, 
          marginTop: theme.spacing.sm 
        }}>
          {onClone && (
            <button
              onClick={handleClone}
              style={{
                ...buttonStyle,
                flex: 1,
                gap: theme.spacing.sm,
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                backgroundColor: '#f0f9ff',
                color: theme.colors.accent,
                fontWeight: theme.fonts.medium,
              }}
            >
              <FiCopy size={16} />
              Clone
            </button>
          )}
          <button
            onClick={handleDelete}
            style={{
              ...buttonStyle,
              flex: 1,
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              fontWeight: theme.fonts.medium,
            }}
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;