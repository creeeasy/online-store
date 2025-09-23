import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import { FiGift, FiTag, FiClock } from 'react-icons/fi';
import { useProduct } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import type { IDynamicField } from '../types/product';
import { 
  useProductInquiry, 
} from '../hooks/useOrderInquiry';
import { customerDataValidation, ValidationErrors, validateAlgerianPhone } from '../types/orderInquiry';
import { WilayaSelect } from '../components/WilayaInput';

const SERVER_URL = 'http://localhost:5001';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
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
    // Validate all fields
    if (!validateAllFields()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      console.log(customerData)
      // Submit the inquiry
      await submitInquiry(customerData, quantity, selectedVariants);
      console.log("success")
      // Success navigation
      navigate('/thank-you', { 
        state: { 
          productName: product.name,
          customerData,
          inquiryData: {
            quantity,
            selectedVariants,
            totalPrice: calculateTotalPrice()
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

  const isOfferActive = (offer: any) => {
    if (!offer.isActive) return false;
    if (offer.validUntil) {
      const validDate = new Date(offer.validUntil);
      return validDate > new Date();
    }
    return true;
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const unitPrice = product.discountPrice || product.price;
    return unitPrice * quantity;
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

            {/* Order Form Section */}
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
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Order Inquiry
                </h2>
                <p className="mt-2 opacity-90">
                  Get a personalized quote or ask any questions about this product
                </p>
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
                
                {/* Quantity Selector */}
                <div 
                  className="mb-6 p-4 rounded-xl"
                  style={{ backgroundColor: theme.colors.backgroundSecondary }}
                >
                  <h3 
                    className="text-lg font-bold mb-4"
                    style={{ 
                      color: theme.colors.text,
                      fontFamily: theme.fonts.family.heading
                    }}
                  >
                    Quantity
                  </h3>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center"
                      style={{
                        backgroundColor: theme.colors.surface,
                        border: `2px solid ${theme.colors.border}`,
                        color: theme.colors.textSecondary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = productColors.primary;
                        e.currentTarget.style.color = productColors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = theme.colors.border;
                        e.currentTarget.style.color = theme.colors.textSecondary;
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
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center"
                      style={{
                        backgroundColor: theme.colors.surface,
                        border: `2px solid ${theme.colors.border}`,
                        color: theme.colors.textSecondary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = productColors.primary;
                        e.currentTarget.style.color = productColors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = theme.colors.border;
                        e.currentTarget.style.color = theme.colors.textSecondary;
                      }}
                    >
                      +
                    </button>
                    <div style={{ color: theme.colors.textSecondary, marginLeft: theme.spacing.md }}>
                      Total: <span 
                        style={{ 
                          fontWeight: theme.fonts.weight.bold,
                          color: productColors.primary
                        }}
                      >
                        ${calculateTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

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
                    color: isSubmitting
                      ? theme.colors.textMuted
                      : theme.colors.textOnPrimary,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: isSubmitting ? 'none' : theme.shadows.lg
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = `linear-gradient(to right, ${productColors.primaryDark}, ${productColors.primary})`;
                      e.currentTarget.style.boxShadow = theme.shadows.xl;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = `linear-gradient(to right, ${productColors.primary}, ${productColors.primaryDark})`;
                      e.currentTarget.style.boxShadow = theme.shadows.lg;
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </div>

            {/* Offers Section */}
            {product.offers && product.offers.filter((offer) => isOfferActive(offer)).length > 0 && (
              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  background: `linear-gradient(to right, ${productColors.primary}, ${productColors.primaryDark})`,
                  borderColor: productColors.primaryDark,
                  boxShadow: theme.shadows.lg
                }}
              >
                <h3 
                  className="text-xl font-bold mb-4 flex items-center gap-2"
                  style={{ 
                    color: theme.colors.textOnPrimary,
                    fontFamily: theme.fonts.family.heading
                  }}
                >
                  <FiGift className="text-white" />
                  Special Offers
                </h3>
                <div className="space-y-4">
                  {product.offers
                    .filter((offer) => isOfferActive(offer))
                    .map((offer) => (
                      <div 
                        key={offer._id} 
                        className="p-4 rounded-xl border"
                        style={{
                          backgroundColor: theme.colors.surface,
                          borderColor: productColors.primaryLight
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <FiTag style={{ color: productColors.primary }} />
                          <h4 
                            className="font-bold"
                            style={{ color: productColors.primaryDark }}
                          >
                            {offer.title}
                          </h4>
                          {offer.discount && (
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: theme.colors.success,
                                color: theme.colors.textOnPrimary
                              }}
                            >
                              {offer.discount}% OFF
                            </span>
                          )}
                        </div>
                        {offer.description && (
                          <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                            {offer.description}
                          </p>
                        )}
                        {offer.validUntil && (
                          <div 
                            className="flex items-center gap-2 text-sm"
                            style={{ color: productColors.primary }}
                          >
                            <FiClock size={14} />
                            <span>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Product Description */}
            <div 
              className="p-8 rounded-2xl shadow-lg border"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                boxShadow: theme.shadows.lg
              }}
            >
              <h3 
                className="text-xl font-bold mb-4"
                style={{ 
                  color: theme.colors.text,
                  fontFamily: theme.fonts.family.heading
                }}
              >
                Product Description
              </h3>
              <div 
                className="prose max-w-none leading-relaxed"
                style={{ 
                  color: theme.colors.textSecondary,
                  lineHeight: theme.fonts.lineHeight.relaxed
                }}
              >
                <p>{product.description}</p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;