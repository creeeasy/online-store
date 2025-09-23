import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import { FiGift, FiTag, FiClock, FiStar, FiCheck, FiShoppingCart } from 'react-icons/fi';
import { useProduct } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import type { IDynamicField, IHiddenField, IOffer } from '../types/product';
import { 
  useProductInquiry, 
} from '../hooks/useOrderInquiry';
import { customerDataValidation, ValidationErrors, validateAlgerianPhone } from '../types/orderInquiry';
import { WilayaSelect } from '../components/WilayaInput';

const SERVER_URL = 'http://localhost:5001';

// Define offer selection interface
interface ISelectedOffer {
  offer: IOffer;
  quantity: number;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedOffers, setSelectedOffers] = useState<ISelectedOffer[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [customerData, setCustomerData] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { theme } = useTheme();

  // Use React Query hook for product data
  const { 
    data: productResponse, 
    isLoading, 
    error: productError 
  } = useProduct(id || '');

  // Use the product inquiry hook
  const { submitInquiry, isLoading: isSubmitting, validationErrors } = useProductInquiry(id);

  // Extract product from the response
  const product = productResponse?.data || productResponse;

  // Color Priority Logic: Use admin-defined colors first, fallback to theme colors
  const getProductColors = () => {
    // Check if product has admin-defined colors that are available
    const adminColors = product?.colors?.filter((color: any) => color.isAvailable);
    
    if (adminColors && adminColors.length > 0) {
      // Use the first available admin-defined color
      const primaryColor = adminColors[0];
      return {
        primary: primaryColor.hexCode,
        primaryLight: lightenColor(primaryColor.hexCode, 20),
        primaryDark: darkenColor(primaryColor.hexCode, 20),
        colorName: primaryColor.name
      };
    }
    
    // Fallback to theme colors
    return {
      primary: theme.colors.primary,
      primaryLight: theme.colors.primaryLight,
      primaryDark: theme.colors.primaryDark,
      colorName: 'Theme Color'
    };
  };

  // Helper functions for color manipulation
  const lightenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const darkenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  };

  const productColors = getProductColors();

  // Get all required customer data fields from product
  const getCustomerDataFields = () => {
    const fields: IDynamicField[] = [];
    
    if (product?.dynamicFields) {
      product.dynamicFields.forEach(field => {
        if (field.isRequired) {
          fields.push(field);
        }
      });
    }
    
    return fields;
  };

  // Add this function to get hidden fields
  const getHiddenFields = () => {
    return product?.hiddenFields?.filter(field => field.key && field.value) || [];
  };

  // Add this function to handle hidden field injection
  const injectHiddenFields = () => {
    const hiddenFields = getHiddenFields();
    
    // Create a hidden container for all hidden fields
    return (
      <div style={{ display: 'none' }} className="hidden-fields-container">
        {hiddenFields.map((field: IHiddenField, index: number) => (
          <div 
            key={field._id || `hidden-${index}`}
            data-field-key={field.key}
            data-field-value={field.value}
            data-field-description={field.description || ''}
            className="hidden-field"
          >
            {field.value}
          </div>
        ))}
      </div>
    );
  };

  // Add this function to get hidden fields as data attributes for forms
  const getHiddenFieldsDataAttributes = () => {
    const hiddenFields = getHiddenFields();
    const attributes: Record<string, string> = {};
    
    hiddenFields.forEach(field => {
      if (field.key && field.value) {
        attributes[`data-hidden-${field.key}`] = field.value;
      }
    });
    
    return attributes;
  };

  // Check if offer is active
  const isOfferActive = (offer: IOffer) => {
    if (!offer.isActive) return false;
    if (offer.validUntil) {
      const validDate = new Date(offer.validUntil);
      return validDate > new Date();
    }
    return true;
  };

  // Get active offers
  const getActiveOffers = () => {
    return product?.offers?.filter(offer => isOfferActive(offer)) || [];
  };

  // Add offer to selection
  const addOfferToSelection = (offer: IOffer) => {
    setSelectedOffers(prev => {
      const existing = prev.find(item => item.offer._id === offer._id);
      if (existing) {
        return prev.map(item => 
          item.offer._id === offer._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { offer, quantity: 1 }];
    });
  };

  // Remove offer from selection
  const removeOfferFromSelection = (offerId: string) => {
    setSelectedOffers(prev => prev.filter(item => item.offer._id !== offerId));
  };

  // Update offer quantity
  const updateOfferQuantity = (offerId: string, quantity: number) => {
    if (quantity <= 0) {
      removeOfferFromSelection(offerId);
      return;
    }
    
    setSelectedOffers(prev => 
      prev.map(item => 
        item.offer._id === offerId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Calculate total items
  const getTotalItems = () => {
    return selectedOffers.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price with offers
  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    return selectedOffers.reduce((total, selectedOffer) => {
      const basePrice = product.discountPrice || product.price;
      let itemPrice = basePrice;
      
      // Apply offer discount if available
      if (selectedOffer.offer.discount) {
        itemPrice = basePrice * (1 - selectedOffer.offer.discount / 100);
      }
      
      return total + (itemPrice * selectedOffer.quantity);
    }, 0);
  };

  // Calculate savings percentage
  const calculateSavingsPercentage = () => {
    if (!product || selectedOffers.length === 0) return 0;
    
    const baseTotal = (product.discountPrice || product.price) * getTotalItems();
    const discountedTotal = calculateTotalPrice();
    
    return ((baseTotal - discountedTotal) / baseTotal) * 100;
  };

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

  // Validate a single field
  const validateField = (key: string, value: string): string => {
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    
    // Special validation for phone numbers
    if (key.toLowerCase().includes('phone')) {
      if (!validateAlgerianPhone(value)) {
        return ValidationErrors.PHONE_INVALID;
      }
    }
    
    // Special validation for names
    if (key.toLowerCase().includes('name')) {
      if (value.trim().length < customerDataValidation.name.minLength) {
        return ValidationErrors.NAME_TOO_SHORT;
      }
      if (value.trim().length > customerDataValidation.name.maxLength) {
        return ValidationErrors.NAME_TOO_LONG;
      }
      if (!customerDataValidation.name.pattern.test(value)) {
        return ValidationErrors.NAME_INVALID_CHARS;
      }
    }
    
    return '';
  };

  // Validate all fields
  const validateAllFields = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;
    
    // Validate customer data fields
    Object.entries(customerData).forEach(([key, value]) => {
      const error = validateField(key, value as string);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });
    
    // Check if all required fields are present
    const requiredFields = getCustomerDataFields();
    requiredFields.forEach(field => {
      if (!customerData[field.key] || customerData[field.key].trim() === '') {
        errors[field.key] = `${field.placeholder || field.key} is required`;
        isValid = false;
      }
    });
    
    setFieldErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async () => {
    if (selectedOffers.length === 0) {
      toast.error('Please select at least one offer before submitting');
      return;
    }

    // Validate all fields
    if (!validateAllFields()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      // Submit the inquiry with offers data
      await submitInquiry(
        customerData, 
        getTotalItems(), 
        selectedVariants,
        selectedOffers // Pass offers selection
      );

      // Success navigation
      navigate('/thank-you', { 
        state: { 
          productName: product.name,
          customerData,
          inquiryData: {
            selectedOffers,
            totalItems: getTotalItems(),
            selectedVariants,
            totalPrice: calculateTotalPrice(),
            savings: calculateSavingsPercentage()
          }
        }
      });
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      // Error handling is done in the hook
    }
  };

  const calculateSavings = () => {
    if (!product?.discountPrice) return 0;
    return ((product.price - product.discountPrice) / product.price) * 100;
  };

  const handleVariantChange = (category: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoading) {
    return (
      <div style={{
        background: theme.colors.background,
        minHeight: '100vh'
      }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Gallery Skeleton */}
              <div className="space-y-4">
                <div 
                  className="aspect-square rounded-2xl animate-pulse"
                  style={{ backgroundColor: theme.colors.gray200 }}
                ></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded-lg animate-pulse"
                      style={{ backgroundColor: theme.colors.gray200 }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-6">
                <div 
                  className="h-8 rounded animate-pulse"
                  style={{ backgroundColor: theme.colors.gray200 }}
                ></div>
                <div 
                  className="h-6 rounded w-1/3 animate-pulse"
                  style={{ backgroundColor: theme.colors.gray200 }}
                ></div>
                <div className="space-y-2">
                  <div 
                    className="h-4 rounded animate-pulse"
                    style={{ backgroundColor: theme.colors.gray200 }}
                  ></div>
                  <div 
                    className="h-4 rounded w-3/4 animate-pulse"
                    style={{ backgroundColor: theme.colors.gray200 }}
                  ></div>
                </div>
                <div 
                  className="h-64 rounded-2xl animate-pulse"
                  style={{ backgroundColor: theme.colors.gray200 }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div 
        style={{
          background: theme.colors.background,
          minHeight: '100vh'
        }}
        className="flex items-center justify-center"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: theme.colors.error + '20' }}
            >
              <svg 
                className="w-12 h-12" 
                fill="none" 
                stroke={theme.colors.error} 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.005-5.5-2.5" />
              </svg>
            </div>
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Product Not Found
            </h2>
            <p 
              className="mb-8"
              style={{ color: theme.colors.textSecondary }}
            >
              {productError?.message || "Sorry, we couldn't find the product you're looking for."}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: productColors.primary,
                color: theme.colors.textOnPrimary,
                boxShadow: theme.shadows.md
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = productColors.primaryDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = productColors.primary;
              }}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeOffers = getActiveOffers();

  return (
    <div style={{
      background: `linear-gradient(to bottom right, ${theme.colors.background}, ${theme.colors.backgroundSecondary})`,
      minHeight: '100vh'
    }}>
      {/* Breadcrumb */}
      <div style={{
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.border}`
      }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <button 
              onClick={() => window.location.href = '/'}
              className="transition-colors duration-300"
              style={{ color: theme.colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = productColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              Home
            </button>
            <span>→</span>
            <button 
              onClick={() => window.location.href = '/products'}
              className="transition-colors duration-300"
              style={{ color: theme.colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = productColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              Products
            </button>
            <span>→</span>
            <span 
              style={{ 
                color: productColors.primary,
                fontWeight: theme.fonts.weight.medium
              }}
            >
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Inject hidden fields into DOM */}
        {injectHiddenFields()}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Section */}
          <div className="lg:sticky lg:top-8 self-start">
            <ProductGallery 
              images={product.images?.map((img: string) => 
                img.startsWith('http') ? img : `${SERVER_URL}${img}`
              ) || []} 
            />
          </div>
          
          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 
                className="text-4xl font-bold mb-4 leading-tight"
                style={{ 
                  color: theme.colors.text,
                  fontFamily: theme.fonts.family.heading
                }}
              >
                {product.name}
              </h1>
              
              {/* Price Section */}
              <div className="flex items-center gap-4 mb-6">
                {product.discountPrice ? (
                  <div className="flex items-center gap-4">
                    <span 
                      style={{
                        color: productColors.primary,
                        fontSize: theme.fonts.size['4xl'],
                        fontWeight: theme.fonts.weight.bold
                      }}
                    >
                      ${product.discountPrice.toFixed(2)}
                    </span>
                    <div className="flex flex-col">
                      <span 
                        className="text-xl line-through"
                        style={{ color: theme.colors.textMuted }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                      <span 
                        className="text-sm font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: theme.colors.success,
                          color: theme.colors.textOnPrimary
                        }}
                      >
                        {Math.round(calculateSavings())}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <span 
                    style={{
                      color: productColors.primary,
                      fontSize: theme.fonts.size['4xl'],
                      fontWeight: theme.fonts.weight.bold
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Offers Selection Section - REPLACES Quantity Selector */}
            <div 
              className="rounded-2xl shadow-xl overflow-hidden"
              style={{
                backgroundColor: theme.colors.surface,
                border: `2px solid ${productColors.primary}`,
                boxShadow: theme.shadows.lg
              }}
            >
              <div 
                style={{
                  background: `linear-gradient(to right, ${productColors.primary}, ${productColors.primaryDark})`,
                  color: theme.colors.textOnPrimary,
                  padding: theme.spacing.lg
                }}
              >
                <h2 
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ fontFamily: theme.fonts.family.heading }}
                >
                  <FiShoppingCart className="text-white" />
                  Select Offers
                  {selectedOffers.length > 0 && (
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-bold ml-2"
                      style={{
                        backgroundColor: theme.colors.textOnPrimary + '20',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {getTotalItems()} items selected
                    </span>
                  )}
                </h2>
                <p className="mt-2 opacity-90">
                  Choose from available promotions and deals
                </p>
              </div>
              
              <div style={{ padding: theme.spacing.lg }}>
                {/* Selected Offers Summary */}
                {selectedOffers.length > 0 && (
                  <div 
                    className="mb-6 p-4 rounded-xl border-2"
                    style={{
                      backgroundColor: theme.colors.success + '10',
                      borderColor: theme.colors.success,
                      borderStyle: 'dashed'
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold" style={{ color: theme.colors.success }}>
                        Selected Offers
                      </span>
                      <span className="font-bold" style={{ color: productColors.primary }}>
                        Total: ${calculateTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    {calculateSavingsPercentage() > 0 && (
                      <div className="text-sm" style={{ color: theme.colors.success }}>
                        You're saving {calculateSavingsPercentage().toFixed(1)}%!
                      </div>
                    )}
                    
                    {/* Selected offers list */}
                    <div className="mt-3 space-y-2">
                      {selectedOffers.map((selectedOffer) => (
                        <div key={selectedOffer.offer._id} className="flex justify-between items-center text-sm">
                          <span>{selectedOffer.offer.title} × {selectedOffer.quantity}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateOfferQuantity(selectedOffer.offer._id!, selectedOffer.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{
                                backgroundColor: theme.colors.error,
                                color: theme.colors.textOnPrimary
                              }}
                            >
                              −
                            </button>
                            <span>{selectedOffer.quantity}</span>
                            <button 
                              onClick={() => updateOfferQuantity(selectedOffer.offer._id!, selectedOffer.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{
                                backgroundColor: theme.colors.success,
                                color: theme.colors.textOnPrimary
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Offers */}
                <div className="space-y-4">
                  {activeOffers.map((offer, index) => (
                    <div 
                      key={offer._id || `offer-${index}`}
                      className="p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      style={{
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: selectedOffers.some(so => so.offer._id === offer._id)
                          ? theme.colors.success
                          : productColors.primaryLight,
                        borderStyle: selectedOffers.some(so => so.offer._id === offer._id) 
                          ? 'solid' 
                          : 'dashed'
                      }}
                      onClick={() => addOfferToSelection(offer)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: selectedOffers.some(so => so.offer._id === offer._id)
                                ? theme.colors.success
                                : productColors.primary,
                              color: theme.colors.textOnPrimary
                            }}
                          >
                            <FiGift size={18} />
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
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <FiCheck 
                            size={16} 
                            style={{ 
                              color: selectedOffers.some(so => so.offer._id === offer._id)
                                ? theme.colors.success
                                : theme.colors.textMuted
                            }} 
                          />
                          <span style={{ 
                            color: selectedOffers.some(so => so.offer._id === offer._id)
                              ? theme.colors.success
                              : theme.colors.textMuted,
                            fontWeight: '600' 
                          }}>
                            {selectedOffers.some(so => so.offer._id === offer._id)
                              ? 'Added to order'
                              : 'Click to add to order'
                            }
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <div 
                            className="font-bold"
                            style={{ color: productColors.primary }}
                          >
                            ${((product.discountPrice || product.price) * (1 - (offer.discount || 0) / 100)).toFixed(2)}
                          </div>
                          {offer.discount && offer.discount > 0 && (
                            <div 
                              className="text-sm line-through"
                              style={{ color: theme.colors.textMuted }}
                            >
                              ${(product.discountPrice || product.price).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {activeOffers.length === 0 && (
                  <div 
                    className="text-center p-8 rounded-xl"
                    style={{
                      backgroundColor: theme.colors.backgroundSecondary,
                      border: `2px dashed ${theme.colors.border}`
                    }}
                  >
                    <FiGift size={48} style={{ color: theme.colors.textMuted, margin: '0 auto 1rem' }} />
                    <p style={{ color: theme.colors.textMuted }}>
                      No active offers available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Form Section */}
            <div 
              className="rounded-2xl shadow-xl overflow-hidden"
              style={{
                backgroundColor: theme.colors.surface,
                border: `2px solid ${productColors.primary}`,
                boxShadow: theme.shadows.lg
              }}
              {...getHiddenFieldsDataAttributes()}
            >
              <div 
                style={{
                  background: `linear-gradient(to right, ${productColors.primary}, ${productColors.primaryDark})`,
                  color: theme.colors.textOnPrimary,
                  padding: theme.spacing.lg
                }}
              >
                <h2 
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ fontFamily: theme.fonts.family.heading }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Order Inquiry
                </h2>
                <p className="mt-2 opacity-90">
                  Get a personalized quote or ask any questions about this product
                </p>
                {activeOffers.length > 0 && (
                  <p className="mt-1 text-sm opacity-80">
                    ⚡ Special offers will be automatically applied to your order
                  </p>
                )}
              </div>
              
              <div style={{ padding: theme.spacing.xl }}>
                {/* Display form errors */}
                {(Object.keys(fieldErrors).length > 0 || validationErrors.length > 0) && (
                  <div 
                    className="mb-6 p-4 rounded-xl"
                    style={{
                      backgroundColor: theme.colors.error + '15',
                      border: `1px solid ${theme.colors.error}`,
                      color: theme.colors.error
                    }}
                  >
                    <h4 className="font-bold mb-2">Please fix the following errors:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(fieldErrors).map(([field, error], index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {validationErrors.map((error, index) => (
                        <li key={`val-${index}`}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Customer Data Fields */}
                <div className="space-y-6">
                  {getCustomerDataFields().map((field) => (
                    <div key={field.key}>
                      {field.key === "wilaya" ? (
                        <WilayaSelect
                          fieldName={field.key}
                          value={customerData[field.key] || ''}
                          onChange={(e) => handleCustomerDataChange(field.key, e.target.value)}
                          required={field.isRequired}
                          errors={
                            fieldErrors[field.key]
                              ? { [field.key]: [fieldErrors[field.key]] }
                              : {}
                          }
                        />
                      ) : (
                        <>
                          <label 
                            className="block text-sm font-semibold mb-2"
                            style={{ color: theme.colors.text }}
                          >
                            {field.placeholder} {field.isRequired && '*'}
                          </label>
                          <input
                            type="text"
                            value={customerData[field.key] || ''}
                            onChange={(e) => handleCustomerDataChange(field.key, e.target.value)}
                            className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                            style={{
                              backgroundColor: theme.colors.surface,
                              borderColor: fieldErrors[field.key] 
                                ? theme.colors.error 
                                : theme.colors.border,
                              color: theme.colors.text
                            }}
                            onFocus={(e) => {
                              if (!fieldErrors[field.key]) {
                                e.currentTarget.style.borderColor = productColors.primary;
                              }
                            }}
                            onBlur={(e) => {
                              if (!fieldErrors[field.key]) {
                                e.currentTarget.style.borderColor = theme.colors.border;
                              }
                            }}
                            placeholder={field.placeholder}
                          />
                        </>
                      )}

                      {fieldErrors[field.key] && (
                        <p 
                          className="text-sm mt-1"
                          style={{ color: theme.colors.error }}
                        >
                          {fieldErrors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Predefined Variants */}
                {product.predefinedFields && product.predefinedFields.some((field) => field.isActive && field.selectedOptions.length > 0) && (
                  <div className="space-y-4 mt-6">
                    <h3 
                      className="text-lg font-bold"
                      style={{ 
                        color: theme.colors.text,
                        fontFamily: theme.fonts.family.heading
                      }}
                    >
                      Product Options
                    </h3>
                    {product.predefinedFields
                      .filter((field) => field.isActive && field.selectedOptions.length > 0)
                      .map((field) => (
                        <div key={field.category}>
                          <label 
                            className="block text-sm font-semibold mb-2 capitalize"
                            style={{ color: theme.colors.text }}
                          >
                            {field.category}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {field.selectedOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleVariantChange(field.category, option)}
                                className="px-4 py-2 rounded-lg border-2 transition-all capitalize"
                                style={{
                                  borderColor: selectedVariants[field.category] === option
                                    ? productColors.primary
                                    : theme.colors.border,
                                  backgroundColor: selectedVariants[field.category] === option
                                    ? productColors.primary
                                    : theme.colors.surface,
                                  color: selectedVariants[field.category] === option
                                    ? theme.colors.textOnPrimary
                                    : theme.colors.text
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedVariants[field.category] !== option) {
                                    e.currentTarget.style.borderColor = productColors.primary;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedVariants[field.category] !== option) {
                                    e.currentTarget.style.borderColor = theme.colors.border;
                                  }
                                }}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Notes Field */}
                <div className="mt-6">
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme.colors.text }}
                  >
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-vertical"
                    style={{
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = productColors.primary;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.border;
                    }}
                    placeholder="Any special requests or questions?"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] mt-6"
                  style={{
                    background: isSubmitting
                      ? theme.colors.disabled
                      : `linear-gradient(to right, ${productColors.primary}, ${productColors.primaryDark})`,
                    color: theme.colors.textOnPrimary,
                    boxShadow: theme.shadows.lg
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </div>

            {/* Product Description */}
            <div 
              className="rounded-2xl shadow-xl overflow-hidden"
              style={{
                backgroundColor: theme.colors.surface,
                border: `2px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.md
              }}
            >
              <div style={{ padding: theme.spacing.xl }}>
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: theme.fonts.family.heading
                  }}
                >
                  Product Details
                </h2>
                <div 
                  className="prose max-w-none"
                  style={{ color: theme.colors.textSecondary }}
                  dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;