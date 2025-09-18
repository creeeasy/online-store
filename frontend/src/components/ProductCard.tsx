import React from 'react';
import { FiEdit, FiTrash2, FiCheck, FiGift, FiCopy, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';

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

  // Theme-based styles
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
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
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = theme.shadows.md;
          e.currentTarget.style.transform = 'translateY(0)';
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
              src={product.images[0] || 'https://picsum.photos/300/300?random=default'}
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
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: theme.spacing.sm,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
          onMouseEnter={(e) => {
            const parent = e.currentTarget.closest('[data-card]');
            if (parent) {
              e.currentTarget.style.opacity = '1';
            }
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              style={{
                ...iconButtonStyle,
                color: theme.colors.primary,
              }}
              title="Edit product"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClone?.(product);
              }}
              style={{
                ...iconButtonStyle,
                color: theme.colors.accent,
              }}
              title="Clone product"
            >
              <FiCopy size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              style={{
                ...iconButtonStyle,
                color: '#ef4444',
              }}
              title="Delete product"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={cardStyle}
      onClick={handleViewDetails}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.lg;
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.md;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div style={{ position: 'relative', height: '192px', overflow: 'hidden' }}>
        <img
          src={product.images[0] || 'https://picsum.photos/300/300?random=default'}
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
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }} />
        
        <div style={{
          position: 'absolute',
          top: theme.spacing.sm,
          right: theme.spacing.sm,
          display: 'flex',
          gap: theme.spacing.sm,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
            style={{
              ...iconButtonStyle,
              backgroundColor: `${theme.colors.secondary}E6`,
              color: theme.colors.primary,
            }}
            title="Edit product"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClone?.(product);
            }}
            style={{
              ...iconButtonStyle,
              backgroundColor: `${theme.colors.secondary}E6`,
              color: theme.colors.accent,
            }}
            title="Clone product"
          >
            <FiCopy size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product);
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
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
      </div>
    </div>
  );
};
export default  ProductCard;