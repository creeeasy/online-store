import React from 'react';
import { FiGift, FiEye } from 'react-icons/fi';
import type { IProduct } from '../types/product';
import { useTheme } from '../contexts/ThemeContext';
import { SERVER_URL } from '../utils/apiClient';

interface ClientProductCardProps {
  product: IProduct;
  onViewDetails: (product: IProduct) => void;
}

const ClientProductCard: React.FC<ClientProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  // Main card container styles
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: isHovered ? theme.shadows.lg : theme.shadows.md,
    border: `1px solid ${isHovered ? theme.colors.primaryLight : theme.colors.border}`,
    overflow: 'hidden',
    transition: theme.transitions.normal,
    transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  // Image section styles
  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    height: '14rem',
    overflow: 'hidden',
    flexShrink: 0,
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: theme.transitions.normal,
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const saleBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.gradientPrimary,
    color: theme.colors.textOnPrimary,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.fonts.size.xs,
    fontWeight: theme.fonts.weight.semiBold,
    textTransform: 'uppercase',
    letterSpacing: theme.fonts.letterSpacing.wide,
    zIndex: theme.zIndex.base,
  };

  // Content section styles
  const bodyStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.family.heading,
    fontWeight: theme.fonts.weight.semiBold,
    color: isHovered ? theme.colors.primary : theme.colors.text,
    fontSize: theme.fonts.size.lg,
    lineHeight: theme.fonts.lineHeight.tight,
    margin: 0,
    transition: theme.transitions.fast,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const descriptionStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    lineHeight: theme.fonts.lineHeight.relaxed,
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flexGrow: 1,
  };

  // Price section styles
  const priceWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    margin: `${theme.spacing.xs} 0`,
  };

  const currentPriceStyle: React.CSSProperties = {
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.xl,
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.family.monospace,
  };

  const oldPriceStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    textDecoration: 'line-through',
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.monospace,
  };

  // Offers section styles
  const offersStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    margin: `${theme.spacing.xs} 0`,
  };

  const offersTextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.primaryDark,
    fontWeight: theme.fonts.weight.medium,
  };

  // Button styles
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: isHovered ? theme.colors.primary : theme.colors.backgroundSecondary,
    color: isHovered ? theme.colors.textOnPrimary : theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    transition: theme.transitions.fast,
    fontWeight: theme.fonts.weight.semiBold,
    border: `2px solid ${isHovered ? theme.colors.primary : 'transparent'}`,
    cursor: 'pointer',
    fontFamily: theme.fonts.family.body,
    fontSize: theme.fonts.size.sm,
    textDecoration: 'none',
    marginTop: 'auto',
  };

  const buttonIconStyle: React.CSSProperties = {
    transition: theme.transitions.fast,
    transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(product);
        }
      }}
    >
      {/* Image Section */}
      <div style={imageWrapperStyle}>
        <img
          src={
            product.images?.[0]
              ? `${SERVER_URL}${product.images[0]}`
              : 'https://picsum.photos/300/300?random=default'
          }
          alt={product.name}
          style={imageStyle}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://picsum.photos/300/300?random=default';
          }}
        />
        {product.discountPrice && (
          <div style={saleBadgeStyle}>
            <span>🔥 Sale</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div style={bodyStyle}>
        <h3 style={titleStyle}>
          {product.name}
        </h3>
        
        <p style={descriptionStyle}>
          {product.description}
        </p>

        {/* Price Section */}
        <div style={priceWrapperStyle}>
          <span style={currentPriceStyle}>
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span style={oldPriceStyle}>
              ${product.price}
            </span>
          )}
        </div>

        {/* Offers Section */}
        {product.offers && product.offers.length > 0 && (
          <div style={offersStyle}>
            <FiGift 
              size={18} 
              style={{ color: theme.colors.primaryDark }} 
            />
            <span style={offersTextStyle}>
              {product.offers.length} special offer{product.offers.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FiEye size={16} style={buttonIconStyle} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ClientProductCard;