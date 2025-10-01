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
    navigate(`/products/${product.reference}`);
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

  // Theme-based styles using your theme structure
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '12px',
    boxShadow: `0 4px 12px ${theme.colors.shadow}`,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem',
    borderRadius: '8px',
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
    color: theme.colors.textOnPrimary,
    fontWeight: '500',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    fontWeight: '500',
  };

  const iconButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.white,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    width: '32px',
    height: '32px',
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...iconButtonStyle,
    backgroundColor: `${theme.colors.error}15`,
    color: theme.colors.error,
  };

  const cloneButtonStyle: React.CSSProperties = {
    ...iconButtonStyle,
    backgroundColor: `${theme.colors.secondary}15`,
    color: theme.colors.secondary,
  };

  if (viewMode === 'list') {
    return (
      <div 
        style={{
          ...cardStyle,
          padding: '1rem',
        }}
        onClick={handleViewDetails}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.shadow}`;
          e.currentTarget.style.transform = 'translateY(-2px)';
          
          // Show action buttons on hover
          const actionButtons = e.currentTarget.querySelector('[data-actions]') as HTMLElement;
          if (actionButtons) {
            actionButtons.style.opacity = '1';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.shadow}`;
          e.currentTarget.style.transform = 'translateY(0)';
          
          // Hide action buttons on leave
          const actionButtons = e.currentTarget.querySelector('[data-actions]') as HTMLElement;
          if (actionButtons) {
            actionButtons.style.opacity = '0';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            position: 'relative', 
            width: '64px', 
            height: '64px', 
            flexShrink: 0 
          }}>
            <img
              src={
                product.images?.[0]
                  ? `${import.meta.env.VITE_SERVER_URL}${product.images[0]}`
                  : 'https://picsum.photos/300/300?random=default'
              }
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            {product.discountPrice && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                padding: '0.5rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}>
                SALE
              </span>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontWeight: '600',
              color: theme.colors.text,
              margin: 0,
              marginBottom: '0.5rem',
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
              marginBottom: '0.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                fontWeight: '700',
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
              gap: '0.75rem',
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
        e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.shadow}`;
        e.currentTarget.style.transform = 'scale(1.02)';
        
        // Show overlay and action buttons on hover
        const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement;
        const actions = e.currentTarget.querySelector('[data-hover-actions]') as HTMLElement;
        if (overlay) overlay.style.opacity = '1';
        if (actions) actions.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.shadow}`;
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
              ? `${import.meta.env.VITE_SERVER_URL}${product.images[0]}`
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
            top: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            gap: '0.75rem',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <button
            onClick={handleEdit}
            style={{
              ...iconButtonStyle,
              backgroundColor: `${theme.colors.white}E6`,
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
                backgroundColor: `${theme.colors.white}E6`,
                color: theme.colors.secondary,
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
              backgroundColor: `${theme.colors.white}E6`,
              color: theme.colors.error,
            }}
            title="Delete product"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
        
        {/* Sale badge */}
        {product.discountPrice && (
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <span style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              padding: '0.5rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '700',
            }}>
              SALE
            </span>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{
          fontWeight: '700',
          color: theme.colors.text,
          fontSize: '1.125rem',
          margin: 0,
          marginBottom: '0.75rem',
        }}>
          {product.name}
        </h3>
        <p style={{
          color: theme.colors.textSecondary,
          fontSize: '0.875rem',
          margin: 0,
          marginBottom: '1rem',
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
          gap: '0.75rem', 
          marginBottom: '1rem' 
        }}>
          <span style={{
            fontWeight: '700',
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
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: theme.colors.textSecondary,
        }}>
          {product.dynamicFields && product.dynamicFields.length > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}>
              <FiCheck size={16} style={{ color: theme.colors.success }} />
              <span>{product.dynamicFields.length} custom field{product.dynamicFields.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {product.predefinedFields && product.predefinedFields.filter(f => f.isActive).length > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}>
              <FiCheck size={16} style={{ color: theme.colors.success }} />
              <span>{product.predefinedFields.filter(f => f.isActive).length} predefined field{product.predefinedFields.filter(f => f.isActive).length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {product.offers && product.offers.length > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}>
              <FiGift size={16} style={{ color: theme.colors.success }} />
              <span>{product.offers.length} active offer{product.offers.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {/* Bottom action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            style={{
              ...secondaryButtonStyle,
              flex: 1,
              gap: '0.75rem',
              padding: '0.75rem 1rem',
            }}
          >
            <FiEye size={16} />
            View
          </button>
          <button
            onClick={handleEdit}
            style={{
              ...primaryButtonStyle,
              flex: 1,
              gap: '0.75rem',
              padding: '0.75rem 1rem',
            }}
          >
            <FiEdit size={16} />
            Edit
          </button>
        </div>

        {/* Additional action buttons row for clone and delete */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          marginTop: '0.75rem' 
        }}>
          {onClone && (
            <button
              onClick={handleClone}
              style={{
                ...buttonStyle,
                flex: 1,
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: `${theme.colors.secondary}15`,
                color: theme.colors.secondary,
                fontWeight: '500',
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
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: `${theme.colors.error}15`,
              color: theme.colors.error,
              fontWeight: '500',
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