import React from 'react';
import { FiGift, FiEye } from 'react-icons/fi';
import type { IProduct } from '../types/product';
import { useTheme } from '../contexts/ThemeContext';
interface ClientProductCardProps {
  product: IProduct;
  onViewDetails: (product: IProduct) => void;
}
const ClientProductCard: React.FC<ClientProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const { theme } = useTheme();
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
  };
  const cardHoverStyle: React.CSSProperties = {
    boxShadow: theme.shadows.lg,
    transform: 'scale(1.03)',
  };
  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    height: '12rem',
    overflow: 'hidden',
  };
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  };
  const saleBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primaryDark,
    color: theme.colors.secondary,
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.bold,
  };
  const bodyStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
  };
  const titleStyle: React.CSSProperties = {
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    fontSize: '1.25rem',
    marginBottom: theme.spacing.sm,
    transition: 'color 0.3s ease',
  };
  const descriptionStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  };
  const priceWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  };
  const currentPriceStyle: React.CSSProperties = {
    fontWeight: theme.fonts.bold,
    fontSize: '1.25rem',
  };
  const oldPriceStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    textDecoration: 'line-through',
    fontSize: '0.875rem',
  };
  const offersStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  };
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    transition: 'all 0.3s ease',
    fontWeight: theme.fonts.medium,
    border: 'none',
    cursor: 'pointer',
  };
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      style={{ ...cardStyle, ...(isHovered ? cardHoverStyle : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageWrapperStyle}>
        <img
          src={product.images[0] || 'https://picsum.photos/300/300?random=default'}
          alt={product.name}
          style={{ ...imageStyle, transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        {product.discountPrice && (
          <div style={saleBadgeStyle}>
            <span>SALE</span>
          </div>
        )}
      </div>
      <div style={bodyStyle}>
        <h3
          style={{ ...titleStyle, color: isHovered ? theme.colors.primaryDark : theme.colors.text }}
        >
          {product.name}
        </h3>
        <p style={descriptionStyle}>
          {product.description}
        </p>
        <div style={priceWrapperStyle}>
          <span
            style={{
              ...currentPriceStyle,
              color: product.discountPrice ? theme.colors.primaryDark : theme.colors.text,
            }}
          >
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span style={oldPriceStyle}>
              ${product.price}
            </span>
          )}
        </div>
        {product.offers && product.offers.length > 0 && (
          <div style={offersStyle}>
            <FiGift size={16} style={{ color: theme.colors.primaryDark }} />
            <span>
              {product.offers.length} special offer{product.offers.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <button
            onClick={() => onViewDetails(product)}
            style={{
              ...buttonStyle,
              ':hover': {
                backgroundColor: theme.colors.primaryLight,
                color: theme.colors.secondary,
              },
            }}
          >
            <FiEye size={16} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
export default ClientProductCard;