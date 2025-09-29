import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

// CORRECT IMPORT for react-meta-pixel
import ReactPixel from 'react-facebook-pixel'; // or the correct package name

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

  const product = productResponse?.product as IProduct;

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideInVariants = {
    hidden: { 
      opacity: 0, 
      x: -50 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const slideInRightVariants = {
    hidden: { 
      opacity: 0, 
      x: 50 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const scaleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  // Fixed Facebook Pixel initialization
  useEffect(() => {
    // Only run if productResponse is available and has pixel data
    if (!productResponse?.pixel) {
      console.log('Pixel data not available yet');
      return;
    }

    const { pixel } = productResponse;
    
    // Check if Facebook Pixel is enabled and has required data
    if (!pixel.facebookPixel || !pixel.pixelId || !pixel.eventTypes?.PageView) {
      console.log('Facebook Pixel not configured or PageView event not enabled');
      return;
    }

    try {
      // Initialize pixel only once
      if (!window.fbq) {
        const options = {
          autoConfig: true,
          debug: false,
        };

        ReactPixel.init(pixel.pixelId, undefined, options);
        console.log("✅ Facebook Pixel initialized with ID:", pixel.pixelId);
      }

      // Track page view
      ReactPixel.pageView();
      console.log("✅ Facebook PageView tracked");

    } catch (error) {
      console.error("❌ Error with Facebook Pixel:", error);
    }
  }, [productResponse]); // Only depend on productResponse

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
      
      // Track Lead event on successful form submission
      if (productResponse?.pixel?.facebookPixel && productResponse.pixel.eventTypes.Lead) {
        ReactPixel.track('Lead');
        console.log("✅ Facebook Lead event tracked");
      }
      
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
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        <LoadingState />
      </motion.div>
    );
  }
  
  // Error state
  if (productError || !product) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
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
      </motion.div>
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
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      style={containerStyle}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          className='flex flex-col'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Gallery Section */}
            <motion.div 
              className="lg:sticky lg:top-8 self-start"
              variants={slideInVariants}
            >
              <ProductGallery 
                images={product.images?.map((img: string) => 
                  img.startsWith('http') ? img : `${SERVER_URL}${img}`
                ) || []}
                accentColor={productColorScheme.primary}
              />
            </motion.div>
            
            {/* Product Info Section */}
            <motion.div 
              className="space-y-6"
              variants={staggerChildrenVariants}
            >
              <motion.div variants={itemVariants}>
                <ProductHeader 
                  product={product}
                  productColors={{
                    primary: productColorScheme.primary,
                    primaryLight: productColorScheme.primaryLight,
                    primaryDark: productColorScheme.primaryDark,
                    colorName: productColorScheme.availableColors[2]?.hexCode || productColorScheme.primary
                  }}
                  customTheme={dynamicTheme}
                />
              </motion.div>

              <motion.div variants={scaleVariants}>
                <OrderForm
                  product={product}
                  onSubmit={handleFormSubmit}
                  errors={validationErrors}
                  isSubmitting={isSubmitting}
                  productColors={productColorScheme}
                  customTheme={dynamicTheme}
                />
              </motion.div>
              
              {product.description && (
                <motion.div variants={itemVariants}>
                  <ProductDetails 
                    product={product} 
                    customTheme={dynamicTheme}
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Additional Images Section */}
          <motion.div 
            className="lg:sticky lg:top-8 mt-8"
            variants={slideInRightVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={staggerChildrenVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {product.images?.map((img: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    className="overflow-hidden rounded-lg shadow-lg"
                  >
                    <motion.img 
                      src={img.startsWith('http') ? img : `${SERVER_URL}${img}`}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-auto object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating background elements animation */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: productColorScheme.primary }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-5"
          style={{ backgroundColor: productColorScheme.primaryLight }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: productColorScheme.primaryDark }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailsPage;