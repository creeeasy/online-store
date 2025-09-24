// components/OffersAndQuantity.tsx
import React from 'react';
import { FiGift, FiTag, FiClock, FiCheck } from 'react-icons/fi';
import type { IOffer, IProduct } from '../types/product';

interface OffersAndQuantityProps {
  product: IProduct;
  selectedOfferId?: string;
  quantity: number;
  onOfferSelect: (offerId: string) => void;
  onQuantityChange: (quantity: number) => void;
  productColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    colorName: string;
  };
  theme: any;
}

const OffersAndQuantity: React.FC<OffersAndQuantityProps> = ({
  product,
  selectedOfferId,
  quantity,
  onOfferSelect,
  onQuantityChange,
  productColors,
  theme
}) => {
  // Get active offers
  const getActiveOffers = (): IOffer[] => {
    if (!product?.offers) return [];
    const now = new Date();
    return product.offers.filter(offer => 
      offer.isActive && 
      (!offer.validUntil || new Date(offer.validUntil) > now)
    );
  };

  const activeOffers = getActiveOffers();
  const showOffers = activeOffers.length > 0;
  const showQuantity = product?.allowMultipleQuantities !== undefined;
  const showBothSections = showOffers && showQuantity;

  // Format offer discount text
  const getOfferDiscountText = (offer: IOffer) => {
    if (offer.discount) {
      return `${offer.discount}% OFF`;
    }
    return 'Special Offer';
  };

  // Calculate days remaining for offer
  const getDaysRemaining = (validUntil: Date) => {
    const now = new Date();
    const validDate = new Date(validUntil);
    const diffTime = validDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate total price
  const calculateTotalPrice = (): number => {
    if (!product) return 0;
    
    if (selectedOfferId) {
      const selectedOffer = activeOffers.find(offer => offer._id === selectedOfferId);
      if (selectedOffer) {
        const basePrice = product.discountPrice || product.price;
        const discount = selectedOffer.discount || 0;
        return Math.round((basePrice * (100 - discount) / 100) * 100) / 100;
      }
    }
    
    const unitPrice = product.discountPrice || product.price;
    return unitPrice * quantity;
  };

  if (!showOffers && !showQuantity) {
    return null; // Don't render anything if neither is available
  }

  return (
    <div className="space-y-8">
      {/* Offers Section */}
      {showOffers && (
        <div 
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: selectedOfferId ? productColors.primary : theme.colors.border,
            boxShadow: theme.shadows.lg
          }}
        >
          <div 
            style={{
              background: `linear-gradient(135deg, ${selectedOfferId ? productColors.primaryDark : productColors.primary}, ${selectedOfferId ? productColors.primary : productColors.primaryLight})`,
              color: theme.colors.textOnPrimary,
              padding: theme.spacing.lg
            }}
          >
            <h2 
              className="text-2xl font-bold flex items-center gap-3"
              style={{ fontFamily: theme.fonts.family.heading }}
            >
              <FiGift className="text-white" />
              Special Offers
              <span 
                className="px-3 py-1 rounded-full text-sm font-bold ml-2"
                style={{
                  backgroundColor: theme.colors.textOnPrimary + '20',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {activeOffers.length} Active
              </span>
            </h2>
            <p className="mt-2 opacity-90">
              {showBothSections 
                ? 'Select an offer OR choose a quantity below' 
                : 'Choose one of our special offers'}
            </p>
          </div>
          
          <div style={{ padding: theme.spacing.lg }}>
            <div className="space-y-4">
              {activeOffers.map((offer, index) => (
                <div 
                  key={offer._id || `offer-${index}`}
                  onClick={() => onOfferSelect(offer._id!)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedOfferId === offer._id ? 'scale-[1.02]' : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    backgroundColor: selectedOfferId === offer._id 
                      ? productColors.primary + '10' 
                      : theme.colors.backgroundSecondary,
                    borderColor: selectedOfferId === offer._id 
                      ? productColors.primary 
                      : productColors.primaryLight,
                    borderStyle: selectedOfferId === offer._id ? 'solid' : 'dashed'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: selectedOfferId === offer._id 
                            ? productColors.primaryDark 
                            : productColors.primary,
                          color: theme.colors.textOnPrimary
                        }}
                      >
                        <FiTag size={18} />
                      </div>
                      <div>
                        <h3 
                          className="font-bold text-lg"
                          style={{ color: theme.colors.text }}
                        >
                          {offer.title}
                        </h3>
                        {offer.discount && (
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-bold mt-1 inline-block"
                            style={{
                              backgroundColor: theme.colors.success,
                              color: theme.colors.textOnPrimary
                            }}
                          >
                            {getOfferDiscountText(offer)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {offer.validUntil && (
                      <div 
                        className="flex items-center gap-2 text-sm px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: productColors.primary + '15',
                          color: productColors.primaryDark
                        }}
                      >
                        <FiClock size={14} />
                        <span className="font-semibold">
                          {getDaysRemaining(offer.validUntil)} days left
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {offer.description && (
                    <p 
                      className="mb-3 leading-relaxed"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {offer.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <FiCheck 
                      size={16} 
                      style={{ color: theme.colors.success }} 
                    />
                    <span style={{ color: theme.colors.success, fontWeight: '600' }}>
                      {selectedOfferId === offer._id ? 'Selected' : 'Click to select this offer'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quantity Section */}
      {showQuantity && (
        <div 
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: quantity > 1 && !selectedOfferId ? productColors.primary : theme.colors.border,
            boxShadow: theme.shadows.lg
          }}
        >
          <div 
            style={{
              background: `linear-gradient(to right, ${quantity > 1 && !selectedOfferId ? productColors.primaryDark : productColors.primary}, ${quantity > 1 && !selectedOfferId ? productColors.primary : productColors.primaryLight})`,
              color: theme.colors.textOnPrimary,
              padding: theme.spacing.lg
            }}
          >
            <h2 
              className="text-2xl font-bold flex items-center gap-3"
              style={{ fontFamily: theme.fonts.family.heading }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Quantity Selection
            </h2>
            <p className="mt-2 opacity-90">
              {showBothSections 
                ? 'Select a quantity OR choose an offer above' 
                : product.allowMultipleQuantities 
                  ? 'Choose how many items you need' 
                  : 'Single item inquiry'}
            </p>
          </div>
          
          <div style={{ padding: theme.spacing.xl }}>
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: theme.colors.backgroundSecondary }}
            >
              <h3 
                className="text-lg font-bold mb-4"
                style={{ 
                  color: theme.colors.text,
                  fontFamily: theme.fonts.family.heading
                }}
              >
                {product.allowMultipleQuantities ? 'Select Quantity' : 'Single Item'}
              </h3>
              
              {product.allowMultipleQuantities ? (
                // Numeric input for multiple quantities
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    disabled={!!selectedOfferId || quantity <= 1}
                    className="w-12 h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: `2px solid ${!selectedOfferId && quantity > 1 ? productColors.primary : theme.colors.border}`,
                      color: !selectedOfferId && quantity > 1 ? productColors.primary : theme.colors.textSecondary
                    }}
                  >
                    −
                  </button>
                  <span 
                    className="text-2xl font-bold min-w-[3rem] text-center"
                    style={{ color: theme.colors.text }}
                  >
                    {quantity}
                  </span>
                  <button 
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={!!selectedOfferId || quantity >= (product.maxQuantityPerInquiry || 10)}
                    className="w-12 h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: `2px solid ${!selectedOfferId && quantity > 1 ? productColors.primary : theme.colors.border}`,
                      color: !selectedOfferId && quantity > 1 ? productColors.primary : theme.colors.textSecondary
                    }}
                  >
                    +
                  </button>
                  
                  {product.maxQuantityPerInquiry && (
                    <span 
                      className="text-sm ml-4"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Max: {product.maxQuantityPerInquiry}
                    </span>
                  )}
                </div>
              ) : (
                // Radio button style for single item (locked to 1)
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: !selectedOfferId ? productColors.primary : theme.colors.border,
                      backgroundColor: !selectedOfferId ? productColors.primary : 'transparent'
                    }}
                  >
                    {!selectedOfferId && (
                      <FiCheck size={12} style={{ color: theme.colors.textOnPrimary }} />
                    )}
                  </div>
                  <span 
                    style={{ 
                      color: !selectedOfferId ? productColors.primary : theme.colors.textSecondary,
                      fontWeight: theme.fonts.weight.medium
                    }}
                  >
                    1 item (default)
                  </span>
                </div>
              )}
              
              <div 
                className="mt-4 text-lg font-bold"
                style={{ color: productColors.primary }}
              >
                Total: ${calculateTotalPrice().toFixed(2)}
              </div>
              
              {selectedOfferId && (
                <div 
                  className="mt-2 text-sm"
                  style={{ color: theme.colors.textMuted }}
                >
                  ⚠️ Quantity selection disabled when an offer is selected
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersAndQuantity;