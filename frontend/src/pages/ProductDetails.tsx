import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import { useProduct } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { ProductHeader } from '../components/ProductHeader';
import { ProductDetails } from '../products/ProductDetails';
import { ErrorState } from '../products/ErrorState';
import { LoadingState } from '../products/LoadingState';
import OrderForm from '../components/OrderForm';
import { useProductInquiry } from '../hooks/useOrderInquiry';
import type { CreateOrderInquiry } from '../types/orderInquiry';

const SERVER_URL = 'http://localhost:5001';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: productResponse, isLoading, error: productError } = useProduct(id || '');
  const { submitInquiry, isLoading: isSubmitting, validationErrors } = useProductInquiry(id);

  const product = productResponse;


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

  // Form submission handler
  const handleFormSubmit = async (data: CreateOrderInquiry) => {
    try {
      await submitInquiry(data);
      toast.success('تم إرسال طلبك بنجاح!');
      navigate('/thank-you');
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      toast.error('فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.');
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
              onSubmit={handleFormSubmit}
              errors={validationErrors}
              isSubmitting={isSubmitting}
            />
            
            {product.description && (
              <ProductDetails product={product} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;