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
import type { IProduct, IProductColor } from '../types/product';

const SERVER_URL = 'http://localhost:5001';

interface ProductColorScheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  colorName: string;
  hasCustomColors: boolean;
  availableColors: IProductColor[];
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: productResponse, isLoading, error: productError } = useProduct(id || '');
  const { submitInquiry, isLoading: isSubmitting, validationErrors } = useProductInquiry(id);

  const product = productResponse as IProduct;

  /**
   * Utility function to lighten a color
   */
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

  /**
   * Utility function to darken a color
   */
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

  /**
   * Get product color scheme - uses product colors if available, otherwise defaults to theme
   */
  const getProductColorScheme = (): ProductColorScheme => {
    // Check if product has colors defined
    if (!product?.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
      return {
        primary: theme.colors.primary,
        primaryLight: theme.colors.primaryLight,
        primaryDark: theme.colors.primaryDark,
        colorName: 'الألوان الافتراضية',
        hasCustomColors: false,
        availableColors: []
      };
    }

    // Filter available colors
    const availableColors = product.colors.filter((color: IProductColor) => 
      color.isAvailable !== false // Include if isAvailable is true or undefined
    );

    // If no available colors, fall back to theme
    if (availableColors.length === 0) {
      return {
        primary: theme.colors.primary,
        primaryLight: theme.colors.primaryLight,
        primaryDark: theme.colors.primaryDark,
        colorName: 'الألوان الافتراضية',
        hasCustomColors: false,
        availableColors: []
      };
    }

    // Use the first available color as primary
    const primaryColor = availableColors[0];
    
    return {
      primary: primaryColor.hexCode,
      primaryLight: lightenColor(primaryColor.hexCode, 20),
      primaryDark: darkenColor(primaryColor.hexCode, 20),
      colorName: primaryColor.name,
      hasCustomColors: true,
      availableColors
    };
  };

  const productColorScheme = getProductColorScheme();

  /**
   * Create dynamic theme based on product colors
   */
  const getDynamicTheme = () => {
    if (!productColorScheme.hasCustomColors) {
      return theme;
    }

    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: productColorScheme.primary,
        primaryLight: productColorScheme.primaryLight,
        primaryDark: productColorScheme.primaryDark,
        // Update gradients with new colors
        gradientPrimary: `linear-gradient(135deg, ${productColorScheme.primary} 0%, ${productColorScheme.primaryLight} 100%)`,
        // Update hover states
        hover: `${productColorScheme.primary}15`,
        pressed: `${productColorScheme.primary}25`,
      }
    };
  };

  const dynamicTheme = getDynamicTheme();

  /**
   * Form submission handler
   */
  const handleFormSubmit = async (data: CreateOrderInquiry) => {
    try {
      await submitInquiry(data);
      toast.success('تم إرسال طلبك بنجاح!', {
        style: {
          background: productColorScheme.hasCustomColors 
            ? `linear-gradient(135deg, ${productColorScheme.primary}, ${productColorScheme.primaryLight})`
            : undefined,
          color: productColorScheme.hasCustomColors ? '#fff' : undefined
        }
      });
      navigate('/thank-you');
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      toast.error('فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Error state
  if (productError || !product) {
    return (
      <ErrorState
        error={productError ?? undefined} 
        productColors={{
          primary: productColorScheme.primary,
          primaryLight: productColorScheme.primaryLight,
          primaryDark: productColorScheme.primaryDark,
          colorName: productColorScheme.colorName
        }} 
        onGoBack={() => window.history.back()} 
      />
    );
  }

  // Container styles with dynamic theme
  const containerStyle: React.CSSProperties = {
    background: productColorScheme.hasCustomColors
      ? `linear-gradient(135deg, ${theme.colors.background} 0%, ${productColorScheme.primary}05 100%)`
      : theme.colors.background,
    minHeight: '100vh'
  };

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-8 self-start">
            <ProductGallery 
              images={product.images?.map((img: string) => 
                img.startsWith('http') ? img : `${SERVER_URL}${img}`
              ) || []}
              accentColor={productColorScheme.primary}
            />
          </div>
          
          <div className="space-y-6">
            <ProductHeader 
              product={product}
              productColors={{
                primary: productColorScheme.primary,
                primaryLight: productColorScheme.primaryLight,
                primaryDark: productColorScheme.primaryDark,
                colorName: productColorScheme.colorName
              }}
              customTheme={dynamicTheme}
            />

            <OrderForm
              product={product}
              onSubmit={handleFormSubmit}
              errors={validationErrors}
              isSubmitting={isSubmitting}
              productColors={productColorScheme}
              customTheme={dynamicTheme}
            />
            
            {product.description && (
              <ProductDetails 
                product={product} 
                customTheme={dynamicTheme}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;