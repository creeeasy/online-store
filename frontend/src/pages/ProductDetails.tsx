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
import { customerDataValidation, ValidationErrors ,validateAlgerianPhone} from '../types/orderInquiry';
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

  // Determine the primary color from the product data
  const primaryColor = product?.colors?.[0]?.hexCode || '#ef4444'; // Default to red if no color is found
  const primaryColorDark = product?.colors?.[0]?.hexCode || '#b91c1c'; // A darker shade for gradients

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

  // Apply theme styles
  const containerStyle = {
    background: `linear-gradient(to bottom right, ${theme.colors.background}, ${theme.colors.backgroundSecondary})`,
    minHeight: '100vh'
  };

  const breadcrumbStyle = {
    backgroundColor: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const orderFormHeaderStyle = {
    background: `linear-gradient(to right, ${primaryColor}, ${primaryColorDark})`,
    color: theme.colors.secondary,
    padding: theme.spacing.lg
  };

  const priceStyle = {
    color: primaryColorDark,
    fontSize: '2.25rem',
    fontWeight: theme.fonts.bold
  };

  const discountBadgeStyle = {
    backgroundColor: primaryColor,
    color: theme.colors.secondary,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.bold
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Gallery Skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div style={containerStyle} className="flex items-center justify-center">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.005-5.5-2.5" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">{productError?.message || "Sorry, we couldn't find the product you're looking for."}</p>
            <button 
              onClick={() => window.history.back()}
              className={`bg-[${primaryColor}] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[${primaryColorDark}] transition-colors duration-300`}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button 
              onClick={() => window.location.href = '/'}
              className={`hover:text-[${primaryColor}] transition-colors`}
            >
              Home
            </button>
            <span>→</span>
            <button 
              onClick={() => window.location.href = '/products'}
              className={`hover:text-[${primaryColor}] transition-colors`}
            >
              Products
            </button>
            <span>→</span>
            <span style={{ color: primaryColor }} className="font-medium">{product.name}</span>
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
              <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Price Section */}
              <div className="flex items-center gap-4 mb-6">
                {product.discountPrice ? (
                  <div className="flex items-center gap-4">
                    <span style={priceStyle}>
                      ${product.discountPrice.toFixed(2)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xl text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span style={discountBadgeStyle}>
                        {Math.round(calculateSavings())}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <span style={priceStyle}>
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Order Form Section */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-[${primaryColor}] overflow-hidden">
              <div style={orderFormHeaderStyle}>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Order Inquiry
                </h2>
                <p className={`text-[${primaryColorDark}] mt-2`}>
                  Get a personalized quote or ask any questions about this product
                </p>
              </div>
              
              <div className="p-8">
                {/* Display form errors */}
                {(Object.keys(fieldErrors).length > 0 || validationErrors.length > 0) && (
                  <div className={`mb-6 p-4 bg-[${primaryColor}] text-white rounded-xl`}>
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
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-[${primaryColor}] text-gray-600 hover:text-[${primaryColorDark}] font-bold transition-colors duration-300 flex items-center justify-center`}
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className={`w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-[${primaryColor}] text-gray-600 hover:text-[${primaryColorDark}] font-bold transition-colors duration-300 flex items-center justify-center`}
                    >
                      +
                    </button>
                    <div className="ml-4 text-gray-600">
                      Total: <span className={`font-bold text-[${primaryColor}]`}>
                        ${calculateTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Data Fields */}
                {getCustomerDataFields().map((field) => (
  <div key={field.key}>
    {field.key === "wilaya" ? (
      <WilayaSelect
        fieldName={field.key} // ✅ required by WilayaSelect
        value={customerData[field.key] || ''}
        onChange={(e) => handleCustomerDataChange(field.key, e.target.value)}
        required={field.isRequired}
        errors={
          fieldErrors[field.key]
            ? { [field.key]: [fieldErrors[field.key]] } // ✅ convert string → Record<string, string[]>
            : {}
        }
      />
    ) : (
      <>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {field.placeholder} {field.isRequired && '*'}
        </label>
        <input
          type="text"
          value={customerData[field.key] || ''}
          onChange={(e) => handleCustomerDataChange(field.key, e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
            fieldErrors[field.key] 
              ? 'border-red-300 focus:border-red-500' 
              : `border-gray-200 focus:border-[${primaryColor}]`
          }`}
          placeholder={field.placeholder}
        />
      </>
    )}

    {fieldErrors[field.key] && (
      <p className={`text-[${primaryColor}] text-sm mt-1`}>{fieldErrors[field.key]}</p>
    )}
  </div>
))}

                {/* Predefined Variants */}
                {product.predefinedFields && product.predefinedFields.some((field) => field.isActive && field.selectedOptions.length > 0) && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Product Options</h3>
                    {product.predefinedFields
                      .filter((field) => field.isActive && field.selectedOptions.length > 0)
                      .map((field) => (
                        <div key={field.category}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                            {field.category}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {field.selectedOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleVariantChange(field.category, option)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                                  selectedVariants[field.category] === option
                                    ? `border-[${primaryColor}] bg-[${primaryColor}] text-white`
                                    : `border-gray-200 hover:border-[${primaryColor}] text-gray-700`
                                }`}
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
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[${primaryColor}] transition-colors resize-vertical`}
                    placeholder="Any special requests or questions?"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : `bg-gradient-to-r from-[${primaryColor}] to-[${primaryColorDark}] text-white hover:from-[${primaryColorDark}] hover:to-[${primaryColor}] transform hover:scale-[1.02] shadow-lg hover:shadow-xl`
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </div>

            {/* Offers Section */}
            {product.offers && product.offers.filter((offer) => isOfferActive(offer)).length > 0 && (
              <div className={`bg-gradient-to-r from-[${primaryColor}] to-[${primaryColorDark}] p-6 rounded-2xl shadow-lg border-2 border-[${primaryColorDark}]`}>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FiGift className="text-white" />
                  Special Offers
                </h3>
                <div className="space-y-4">
                  {product.offers
                    .filter((offer) => isOfferActive(offer))
                    .map((offer) => (
                      <div key={offer._id} className="bg-white p-4 rounded-xl border border-red-200">
                        <div className="flex items-center gap-3 mb-2">
                          <FiTag className={`text-[${primaryColor}]`} />
                          <h4 className={`font-bold text-[${primaryColorDark}]`}>{offer.title}</h4>
                          {offer.discount && (
                            <span className={`bg-[${primaryColor}] text-white px-2 py-1 rounded-full text-xs font-bold`}>
                              {offer.discount}% OFF
                            </span>
                          )}
                        </div>
                        {offer.description && (
                          <p className={`text-gray-600 mb-2`}>{offer.description}</p>
                        )}
                        {offer.validUntil && (
                          <div className={`flex items-center gap-2 text-[${primaryColor}] text-sm`}>
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
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Product Description</h3>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
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