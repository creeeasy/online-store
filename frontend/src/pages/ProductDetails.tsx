import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import { useProduct } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { useProductInquiry } from '../hooks/useOrderInquiry';
import { ProductHeader } from '../components/ProductHeader';
import { OrderForm } from '../components/OrderForm';
import { ProductDetails } from '../products/ProductDetails';
import { ErrorState } from '../products/ErrorState';
import { LoadingState } from '../products/LoadingState';

const SERVER_URL = 'http://localhost:5001';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedOfferId, setSelectedOfferId] = useState<string | undefined>();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [customerData, setCustomerData] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { theme } = useTheme();

  const { data: productResponse, isLoading, error: productError } = useProduct(id || '');
  const { submitInquiry, isLoading: isSubmitting, validationErrors } = useProductInquiry(id);

  const product = productResponse?.data || productResponse;

  // Helper functions
  const getActiveOffers = (): any[] => {
    if (!product?.offers) return [];
    const now = new Date();
    return product.offers.filter((offer: any) => 
      offer.isActive && (!offer.validUntil || new Date(offer.validUntil) > now)
    );
  };

  const activeOffers = getActiveOffers();
  const showOffers = activeOffers.length > 0;
  const showQuantity = product?.allowMultipleQuantities !== undefined;
  const showBothSections = showOffers && showQuantity;

  const getProductColors = () => {
    const adminColors = product?.colors?.filter((color: any) => color.isAvailable);
    
    if (adminColors && adminColors.length > 0) {
      const primaryColor = adminColors[0];
      return {
        primary: primaryColor.hexCode,
        primaryLight: lightenColor(primaryColor.hexCode, 20),
        primaryDark: darkenColor(primaryColor.hexCode, 20),
        colorName: primaryColor.name
      };
    }
    
    return {
      primary: theme.colors.primary,
      primaryLight: theme.colors.primaryLight,
      primaryDark: theme.colors.primaryDark,
      colorName: 'Theme Color'
    };
  };

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

  const getCustomerDataFields = () => {
    return product?.dynamicFields?.filter((field: any) => field.isRequired) || [];
  };

  const getHiddenFieldsDataAttributes = () => {
    const hiddenFields = product?.hiddenFields?.filter((field: any) => field.key && field.value) || [];
    const attributes: Record<string, string> = {};
    
    hiddenFields.forEach((field: any) => {
      if (field.key && field.value) {
        attributes[`data-hidden-${field.key}`] = field.value;
      }
    });
    
    return attributes;
  };

  const getOfferDiscountText = (offer: any) => {
    return offer.discount ? `${offer.discount}% OFF` : 'Special Offer';
  };

  const getDaysRemaining = (validUntil: Date) => {
    const now = new Date();
    const validDate = new Date(validUntil);
    const diffTime = validDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (): number => {
    if (!product) return 0;

    if (selectedOfferId) {
      const selectedOffer = activeOffers.find((offer: any) => offer._id === selectedOfferId);
      if (selectedOffer) {
        return selectedOffer.discountedPrice ?? (product.discountPrice || product.price);
      }
    }

    const unitPrice = product.discountPrice || product.price;
    return unitPrice * quantity;
  };

  // Event handlers
  const handleOfferSelect = (offerId: string | null) => {
    setSelectedOfferId(offerId ?? undefined);
    // Do NOT reset quantity; allow total price to reflect current value
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    setSelectedOfferId(undefined); // deselect offer if quantity changes
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleVariantChange = (category: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [category]: value }));
  };

  // Validation and submission
  const validateSelection = (): boolean => {
    if (!showOffers && !showQuantity) {
      toast.error('This product is not available for inquiries');
      return false;
    }
    
    if (showBothSections && !selectedOfferId && quantity === 1) {
      toast.error('Please select either an offer or a quantity');
      return false;
    }
    
    return true;
  };
const handleFormSubmit = async () => {
  if (!validateSelection()) return;

  try {
    let typeOfOrder: 'offer' | 'quantity';
    let data: string | number;

    if (selectedOfferId) {
      typeOfOrder = 'offer';
      data = selectedOfferId;
    } else {
      typeOfOrder = 'quantity';
      data = quantity;
    }

    const inquiryData = {
      customerData,
      selectedVariants,
      typeOfOrder,
      data,
    };

    await submitInquiry(inquiryData);

    navigate('/thank-you', { 
      state: { 
        productName: product.name,
        typeOfOrder,
        data,
        inquiryData: {
          ...(selectedOfferId ? { offerId: selectedOfferId } : { quantity }),
          selectedVariants,
          totalPrice: calculateTotalPrice(),
        }
      }
    });
  } catch (err) {
    console.error('Failed to submit inquiry:', err);
  }
};


  if (isLoading) return <LoadingState />;
  if (productError || !product) {
    return <ErrorState
      error={productError ?? undefined} 
      productColors={productColors} 
      onGoBack={() => window.history.back()} 
    />;
  }

  return (
    <div style={{ background: theme.colors.background, minHeight: '100vh' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-8 self-start">
            <ProductGallery 
              images={product.images?.map((img: string) => 
                img.startsWith('http') ? img : `${SERVER_URL}${img}`
              ) || []} 
            />
          </div>
          
          <div className="space-y-6">
            <ProductHeader 
              product={product}
              productColors={productColors}
            />

            <OrderForm
              product={product}
              productColors={productColors}
              showOffers={showOffers}
              showQuantity={showQuantity}
              showBothSections={showBothSections}
              activeOffers={activeOffers}
              selectedOfferId={selectedOfferId}
              quantity={quantity}
              customerData={customerData}
              fieldErrors={fieldErrors}
              validationErrors={validationErrors}
              selectedVariants={selectedVariants}
              isSubmitting={isSubmitting}
              onOfferSelect={handleOfferSelect}
              onQuantityChange={handleQuantityChange}
              onCustomerDataChange={handleCustomerDataChange}
              onVariantChange={handleVariantChange}
              onSubmit={handleFormSubmit}
              calculateTotalPrice={calculateTotalPrice}
              getOfferDiscountText={getOfferDiscountText}
              getDaysRemaining={getDaysRemaining}
              getCustomerDataFields={getCustomerDataFields}
              getHiddenFieldsDataAttributes={getHiddenFieldsDataAttributes}
            />

            <ProductDetails product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
