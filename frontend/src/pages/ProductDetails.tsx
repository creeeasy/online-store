import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import EnhancedDynamicForm from '../components/EnhancedDynamicForm';
import { FiGift, FiExternalLink, FiCheck, FiTag, FiClock } from 'react-icons/fi';
import { useProduct } from '../hooks/useProducts';
import { useProductInquiry } from '../hooks/useOrderInquiry';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  // Use React Query hook for product data - updated to match new response structure
  const { 
    data: productResponse, 
    isLoading, 
    error: productError 
  } = useProduct(id || '');
  
  const { 
    submitInquiry, 
    isLoading: submitting, 
    error: submitError, 
    validationErrors 
  } = useProductInquiry(id);

  // Extract product from the response
  const product = productResponse?.data || productResponse;

  const handleFormSubmit = async (formData: Record<string, string>) => {
    if (!id || !product) return;

    try {
      await submitInquiry(formData, quantity, selectedVariants);
      setFormSubmitted(true);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to submit inquiry:', err);
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
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50">
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
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50 flex items-center justify-center">
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
              className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button 
              onClick={() => window.location.href = '/'}
              className="hover:text-red-500 transition-colors"
            >
              Home
            </button>
            <span>→</span>
            <button 
              onClick={() => window.location.href = '/products'}
              className="hover:text-red-500 transition-colors"
            >
              Products
            </button>
            <span>→</span>
            <span className="text-red-500 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Section */}
          <div className="lg:sticky lg:top-8 self-start">
            <ProductGallery images={product.images} />
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
                    <span className="text-4xl font-bold text-red-500">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xl text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {Math.round(calculateSavings())}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-gray-800">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Savings Badge */}
              {product.discountPrice && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 px-4 py-2 rounded-xl mb-6">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">
                    You save ${(product.price - product.discountPrice).toFixed(2)}!
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Product Description</h3>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Predefined Fields (Sizes, Colors, etc.) */}
            {product.predefinedFields && product.predefinedFields.some((field) => field.isActive && field.selectedOptions.length > 0) && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Available Options</h3>
                <div className="space-y-4">
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
                                  ? 'border-red-500 bg-red-50 text-red-700'
                                  : 'border-gray-200 hover:border-red-300 text-gray-700'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Offers Section */}
            {product.offers && product.offers.filter((offer) => isOfferActive(offer)).length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl shadow-lg border-2 border-red-200">
                <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                  <FiGift className="text-red-600" />
                  Special Offers
                </h3>
                <div className="space-y-4">
                  {product.offers
                    .filter((offer) => isOfferActive(offer))
                    .map((offer) => (
                      <div key={offer._id} className="bg-white p-4 rounded-xl border border-red-200">
                        <div className="flex items-center gap-3 mb-2">
                          <FiTag className="text-red-500" />
                          <h4 className="font-bold text-red-700">{offer.title}</h4>
                          {offer.discount && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {offer.discount}% OFF
                            </span>
                          )}
                        </div>
                        {offer.description && (
                          <p className="text-red-600 mb-2">{offer.description}</p>
                        )}
                        {offer.validUntil && (
                          <div className="flex items-center gap-2 text-red-500 text-sm">
                            <FiClock size={14} />
                            <span>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 font-bold transition-colors duration-300 flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 font-bold transition-colors duration-300 flex items-center justify-center"
                >
                  +
                </button>
                <div className="ml-4 text-gray-600">
                  Total: <span className="font-bold text-red-500">
                    ${calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Order Form Section */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-red-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Order Inquiry
                </h2>
                <p className="text-red-100 mt-2">
                  Get a personalized quote or ask any questions about this product
                </p>
              </div>
              
              <div className="p-8">
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      Your inquiry has been submitted successfully. We'll contact you soon with more details.
                    </p>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <>
                    {submitError && (
                      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                        {submitError.message || 'Failed to submit inquiry. Please try again.'}
                      </div>
                    )}
                    {validationErrors && validationErrors.filter(error => !error.field).length > 0 && (
                      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                        <h4 className="font-bold mb-2">Please fix the following errors:</h4>
                        <ul className="list-disc list-inside">
                          {validationErrors
                            .filter(error => !error.field)
                            .map((error, index) => (
                              <li key={index}>{error.message}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                    <EnhancedDynamicForm 
                      productId={product._id}
                      dynamicFields={product.dynamicFields || []}
                      onSubmit={handleFormSubmit}
                      submitting={submitting}
                      validationErrors={validationErrors}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;