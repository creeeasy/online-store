import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IDynamicField, IHiddenField, IOffer, IProduct } from '../types/product';
import { formatAlgerianPhone, validateAlgerianPhone, type CreateOrderInquiry } from '../types/orderInquiry';
import type { ValidationError } from '../hooks/useOrderInquiry';
import type { Theme } from '../types/theme';
import { AlgerianPhoneInput } from './AlgerianPhoneInput';
import { WilayaSelect } from './WilayaInput';
import { useNavigate } from 'react-router-dom';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import * as Bowser from "bowser";
import { useDispatch } from 'react-redux';
import { setOrderState } from '../store/slices/orderSlice';

interface ProductFormProps {
  product: IProduct;
  onSubmit: (formData: CreateOrderInquiry) => Promise<void>;
  errors?: ValidationError[];
  isSubmitting?: boolean;
  productColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    colorName: string;
    hasCustomColors: boolean;
    availableColors: any[];
  };
  customTheme?: Theme;
}

interface ValidationErrors {
  [key: string]: string;
}

const OrderForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  errors = [], 
  isSubmitting = false,
  productColors,
  customTheme
}) => {
  const { theme: baseTheme } = useTheme();
  
  // Use custom theme if provided, otherwise fall back to base theme
  const theme = customTheme || baseTheme;
  const hasCustomColors = productColors?.hasCustomColors || false;

  const [selectedOrderType, setSelectedOrderType] = useState<'offer' | 'quantity'>('offer');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Bot detection states
  const [fingerprint, setFingerprint] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<Record<string, any>>({});
  const [isLoadingFingerprint, setIsLoadingFingerprint] = useState(true);
  const [botScore, setBotScore] = useState(0);

  // Bot detection state
  const [botDetection] = useState({
    startTime: Date.now(),
    keyPressCount: 0,
    mouseMoveCount: 0,
    copyPasteAttempts: 0,
    devToolsOpened: false,
    fastFormCompletion: false,
    suspiciousPatterns: 0,
    timezoneMismatch: false,
    languageMismatch: false,
    browserInconsistencies: 0,
  });

  // Get dynamic colors based on product colors or theme
  const getColors = () => {
    if (hasCustomColors && productColors) {
      // Split colors: index 0 for checkout, index 1 for offers, index 2 for buttons
      const checkoutColor = productColors.availableColors?.[0]?.hexCode || productColors.primary;
      const offerColor = productColors.availableColors?.[1]?.hexCode || productColors.primaryLight;
      const buttonColor = productColors.availableColors?.[2]?.hexCode || productColors.primaryDark;
      
      return {
        primary: checkoutColor,
        primaryLight: offerColor,
        primaryDark: buttonColor,
        primaryAlpha: (alpha: number) => `${checkoutColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
      };
    }
    
    return {
      primary: theme.colors.primary,
      primaryLight: theme.colors.primaryLight,
      primaryDark: theme.colors.primaryDark,
      primaryAlpha: (alpha: number) => `${theme.colors.primary}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
    };
  };

  const colors = getColors();

  // Initialize fingerprinting and bot detection on component mount
  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        const browser = (Bowser as any).getParser(window.navigator.userAgent);
        const browserData = browser.getResult();
        
        const deviceInfo = {
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          colorDepth: window.screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform,
          doNotTrack: navigator.doNotTrack,
          hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
          deviceMemory: (navigator as any).deviceMemory || 'unknown',
          touchSupport: 'ontouchstart' in window,
          plugins: Array.from(navigator.plugins).map(p => p.name).join(', '),
          cookieEnabled: navigator.cookieEnabled,
          batteryApi: 'getBattery' in navigator,
          webglVendor: getWebGLVendor(),
          adBlockEnabled: detectAdBlock(),
          ...browserData
        };

        botDetection.timezoneMismatch = checkTimezoneMismatch();
        botDetection.languageMismatch = checkLanguageMismatch() as boolean;
        botDetection.browserInconsistencies = checkBrowserInconsistencies(browserData);

        setFingerprint(visitorId);
        setDeviceInfo(deviceInfo);
      } catch (error) {
        console.error("Fingerprint error:", error);
        setFingerprint("error-" + Math.random().toString(36).substring(2));
        setDeviceInfo({ error: "Failed to get fingerprint" });
      } finally {
        setIsLoadingFingerprint(false);
      }
    };

    loadFingerprint();

    // Set up bot detection event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      botDetection.keyPressCount += 1;
      
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        botDetection.copyPasteAttempts += 1;
      }
      
      if (e.key === 'Tab') {
        botDetection.suspiciousPatterns += 1;
      }

      if ((e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) || e.key === "F12") {
        e.preventDefault();
      }
    };

    const handleMouseMove = () => {
      botDetection.mouseMoveCount += 1;
    };

    const devToolsDetector = () => {
      const devtools = /./;
      devtools.toString = () => {
        botDetection.devToolsOpened = true;
        return '';
      };
      console.log('%c', devtools);
    };

    const devToolsCheckInterval = setInterval(devToolsDetector, 1000);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    devToolsDetector();

    return () => {
      clearInterval(devToolsCheckInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  

  // Auto-select first offer when component loads
useEffect(() => {
  // Only auto-select if:
  // 1. We have offers
  // 2. There are active offers
  // 3. No offer is currently selected
  // 4. selectedOrderType is 'offer' or offers are the primary option
  if (product.offers && 
      product.offers.length > 0 && 
      !selectedOffer) {
    
    // Find the first active offer
    const firstActiveOffer = product.offers.find((offer: IOffer) => offer.isActive);
    
    if (firstActiveOffer) {
      setSelectedOffer(firstActiveOffer._id);
      
      // Also set order type to 'offer' if offers exist and quantity is not the primary option
      if (!product.allowQuantity || product.offers.length > 0) {
        setSelectedOrderType('offer');
      }
    }
  }
}, [product.offers, selectedOffer, product.allowQuantity]);
  // Helper functions for fingerprinting and bot detection
  const getWebGLVendor = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'no-webgl';
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      return debugInfo 
        ? `${(gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}/${(gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`
        : 'no-debug-info';
    } catch (e) {
      return 'error';
    }
  };

  const detectAdBlock = () => {
    try {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      return isBlocked;
    } catch (e) {
      return false;
    }
  };

  const checkTimezoneMismatch = () => {
    try {
      const guessedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      return (guessedTimezone === 'UTC' && offset !== 0) || 
             (guessedTimezone.includes('Europe') && offset > -180) ||
             (guessedTimezone.includes('Asia') && offset > -540);
    } catch (e) {
      return false;
    }
  };

  const checkLanguageMismatch = () => {
    try {
      const browserLanguage = navigator.language;
      const userLanguage = document.documentElement.lang;
      return userLanguage && browserLanguage !== userLanguage;
    } catch (e) {
      return false;
    }
  };

  const checkBrowserInconsistencies = (browser: any) => {
    let inconsistencies = 0;
    
    if (browser.platform.type === 'mobile' && window.screen.width > 768) {
      inconsistencies++;
    }
    
    if (browser.platform.type === 'desktop' && 'ontouchstart' in window) {
      inconsistencies++;
    }
    
    if (navigator.webdriver || 
        !('callPhantom' in window) || 
        !('_phantom' in window) ||
        navigator.plugins.length === 0 ||
        navigator.languages.length === 0) {
      inconsistencies++;
    }
    
    return inconsistencies;
  };

  const detectBotBehavior = () => {
    let score = 0;

    const completionTime = (Date.now() - botDetection.startTime) / 1000;
    if (completionTime < 5) {
      score += 30;
      botDetection.fastFormCompletion = true;
    }

    if (botDetection.devToolsOpened) {
      score += 50;
    }

    if (botDetection.keyPressCount > 20) {
      score += 20;
    }

    if (botDetection.mouseMoveCount < 3) {
      score += 20;
    }

    if (botDetection.copyPasteAttempts > 0) {
      score += botDetection.copyPasteAttempts * 10;
    }

    if (botDetection.suspiciousPatterns > 0) {
      score += botDetection.suspiciousPatterns * 15;
    }

    if (botDetection.timezoneMismatch) {
      score += 25;
    }

    if (botDetection.languageMismatch) {
      score += 25;
    }

    if (botDetection.browserInconsistencies > 0) {
      score += botDetection.browserInconsistencies * 15;
    }

    if ((navigator as any).webdriver || window.document.documentElement.getAttribute('webdriver')) {
      score += 100;
    }

    return score;
  };

  const getIPInfo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Format price in Algerian Dinar
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let basePrice = product.discountPrice || product.price;
    
    if (selectedOrderType === 'offer' && selectedOffer) {
      const offer = product.offers?.find((o: IOffer) => o._id === selectedOffer);
      if (offer?.discountedPrice) {
        basePrice = offer.discountedPrice;
      } else if (offer?.originalPrice && offer.discountedPrice) {
        basePrice = offer.discountedPrice;
      }
    }
    
    return basePrice * quantity;
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate order type selection
    if (selectedOrderType === 'offer' && !selectedOffer) {
      errors.offer = 'يرجى اختيار عرض';
    }

    if (selectedOrderType === 'quantity' && quantity < 1) {
      errors.quantity = 'الكمية يجب أن تكون أكبر من صفر';
    }

    // Validate dynamic fields
    product.dynamicFields?.forEach((field: IDynamicField) => {
      const fieldValue = dynamicFields[field.key];
      
      if (field.isRequired && (!fieldValue || !fieldValue.trim())) {
        errors[field.key] = `${field.placeholder} مطلوب`;
      } else if (fieldValue && fieldValue.trim().length < 1) {
        errors[field.key] = `${field.placeholder} غير صالح`;
      }
      
      // Special validation for specific field types
      if (field.key === 'phone' && fieldValue) {
        if (!validateAlgerianPhone(fieldValue)) {
          errors[field.key] = 'رقم الهاتف غير صالح (يجب أن يبدأ بـ 05, 06, أو 07)';
        }
      }
      
      if (field.key === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          errors[field.key] = 'البريد الإلكتروني غير صالح';
        }
      }
      
      if (field.key === 'age' && fieldValue) {
        const age = parseInt(fieldValue);
        if (isNaN(age) || age < 1 || age > 120) {
          errors[field.key] = 'العمر غير صالح';
        }
      }

      if (field.key === 'name' && fieldValue && fieldValue.trim().length < 2) {
        errors[field.key] = 'الاسم يجب أن يكون أكثر من حرف واحد';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const navigate = useNavigate()
  const dispatch=useDispatch()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🟡 handleSubmit started');
    
    if (isLoadingFingerprint) {
      setValidationErrors({
        submit: "جاري تحميل معلومات المتصفح... الرجاء الانتظار"
      });
      return;
    }
    
    if (!validateForm()) {
      console.log('🔴 Validation failed - returning early');
      return;
    }

    console.log('🟢 Validation passed - continuing');
    setIsFormSubmitting(true);
    setValidationErrors({});

    try {
      console.log('🟢 Entered try block');
      
      // Calculate bot score
      const calculatedBotScore = detectBotBehavior();
      setBotScore(calculatedBotScore);
      
      // Format phone number if it exists
      const processedFields = { ...dynamicFields };
      if (processedFields.phone) {
        processedFields.phone = formatAlgerianPhone(processedFields.phone);
      }

      const formData: CreateOrderInquiry = {
        productId: product._id,
        typeOfOrder: selectedOrderType,
        offerId: selectedOrderType === 'offer' ? selectedOffer : undefined,
        quantity: selectedOrderType === 'quantity' ? quantity : undefined,
        customerData: processedFields,
        selectedVariants: { ...processedFields, ...selectedVariants },
        totalPrice: calculateTotalPrice()
      };
      
      console.log('🟢 FormData prepared:', formData);
      console.log('🟢 About to call API directly');
      
      // Call the API directly instead of going through onSubmit
      const response = await fetch(`http://localhost:5001/api/order-inquiries/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          botScore: calculatedBotScore,
          fingerprint: fingerprint,
          deviceInfo: deviceInfo,
          userAgent: navigator.userAgent,
          ipInfo: await getIPInfo()
        }),
      });

      const result = await response.json();

      if (response.status === 409) {
        setValidationErrors({
          submit: selectedOrderType === 'offer'
            ? "يمكنك تقديم طلب عرض واحد فقط كل 24 ساعة. يرجى المحاولة مرة أخرى لاحقًا."
            : "يمكنك تقديم طلب واحد فقط كل 24 ساعة. يرجى المحاولة مرة أخرى لاحقًا."
        });
        return;
      }

      if (response.status === 403) {
        setValidationErrors({
          submit: "تم الكشف عن نشاط مشبوه. إذا كنت إنسانًا، يرجى الاتصال بالدعم."
        });
        return;
      }
      
      if (!response.ok || !result.success) {
        // Use the specific message from the response if available
        throw new Error(result.message || 'Failed to create inquiry');
      }
      
      console.log('🟢 API call completed successfully');
      dispatch(setOrderState({order:result.data.inquiry.order,prix:calculateTotalPrice(),productName:product.name}));
      return navigate("/thank-you");
      
      // Reset form or redirect as needed
      
    } catch (error) {
      console.error('🔴 Form submission error:', error);
      setValidationErrors({
        submit: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      console.log('🟡 Finally block executed');
      setIsFormSubmitting(false);
    }
  };

  // Initialize dynamic fields when product changes
  useEffect(() => {
    const initialFields: Record<string, string> = {};
    product.dynamicFields?.forEach((field: IDynamicField) => {
      initialFields[field.key] = '';
    });
    setDynamicFields(initialFields);
  }, [product]);

  // Handle dynamic field change
  const handleDynamicFieldChange = (fieldKey: string, value: string) => {
    setDynamicFields(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[fieldKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  // Handle variant selection
  const handleVariantSelection = (category: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [category]: option
    }));
  };

  // Render field error
  const renderFieldError = (fieldKey: string) => {
    const error = validationErrors[fieldKey] || errors.find(item => item.field === fieldKey)?.message;
    if (!error) return null;
    
    return (
      <div style={{
        fontSize: theme.fonts.size.sm,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
        fontWeight: theme.fonts.weight.medium
      }}>
        {error}
      </div>
    );
  };

  // Get input type based on field key
  const getInputType = (fieldKey: string): string => {
    if (fieldKey === 'email') return 'email';
    if (fieldKey === 'phone') return 'tel';
    if (fieldKey === 'age') return 'number';
    return 'text';
  };

  // Enhanced container styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: hasCustomColors 
      ? `2px solid ${colors.primaryAlpha(0.2)}`
      : `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding:"12px",
    direction: 'rtl',
    textAlign: 'right',
    position: 'relative',
    background: hasCustomColors 
      ? `linear-gradient(135deg, ${theme.colors.surface} 0%, ${colors.primaryAlpha(0.02)} 100%)`
      : theme.colors.surface,
    boxShadow: hasCustomColors 
      ? `0 8px 32px ${colors.primaryAlpha(0.1)}`
      : theme.shadows.md
  };


  // Enhanced button styles
  const getButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: theme.spacing.lg,
    border: `2px solid ${isSelected ? colors.primary : theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: isSelected 
      ? colors.primaryAlpha(0.15)
      : 'transparent',
    color: isSelected ? colors.primaryDark : theme.colors.text,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.medium,
    boxShadow: isSelected 
      ? `0 4px 15px ${colors.primaryAlpha(0.2)}`
      : 'none'
  });

  // Enhanced offer card styles
  const getOfferCardStyle = (isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection:"column",
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    padding: "5px",
    border: `2px solid ${isSelected ? colors.primaryLight : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: isSelected 
      ? `${colors.primaryLight}1A`
      : theme.colors.backgroundSecondary,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isSelected 
      ? `0 6px 20px ${colors.primaryLight}26`
      : theme.shadows.sm
  });
 console.log(product)
  return (
    <div style={containerStyle}>      
      <form onSubmit={handleSubmit}>
        {/* Honeypot field for bot detection */}
        <input type="text" name="honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        
        {product.hiddenFields?.map((field: IHiddenField) => (
          <input
            key={field.key}
            type="hidden"
            name={field.key}
            value={field.value}
          />
        ))}

        {/* Fingerprint loading indicator */}
        {isLoadingFingerprint && (
          <div style={{
            padding: theme.spacing.md,
            backgroundColor: `${colors.primary}15`,
            border: `1px solid ${colors.primaryAlpha(0.3)}`,
            borderRadius: theme.borderRadius.md,
            color: colors.primaryDark,
            marginBottom: theme.spacing.lg,
            textAlign: 'center',
            fontSize: theme.fonts.size.md,
            fontWeight: theme.fonts.weight.medium,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: `2px solid ${colors.primary}`,
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            جاري التحقق من المتصفح... الرجاء الانتظار
          </div>
        )}

        {/* Order Type Selection */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <label style={{
            display: 'block',
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.semiBold,
            color: "black",
            marginBottom: theme.spacing.md
          }}>
            نوع الطلب
          </label>
          
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            flexDirection: 'row-reverse'
          }}>
            {/* Quantity Option */}
            {product.allowQuantity && (
              <button
                type="button"
                onClick={() => setSelectedOrderType('quantity')}
                style={getButtonStyle(selectedOrderType === 'quantity')}
              >
                الطلب بالكمية
              </button>
            )}

            {/* Offer Option */}
            {product.offers && product.offers.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedOrderType('offer')}
                style={getButtonStyle(selectedOrderType === 'offer')}
              >
                العروض الخاصة
              </button>
            )}
          </div>
        </div>

        {/* Quantity Selection */}
        {selectedOrderType === 'quantity' && product.allowQuantity && (
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: theme.fonts.size.lg,
              fontWeight: theme.fonts.weight.semiBold,
              color: "black",
              marginBottom: theme.spacing.md
            }}>
              الكمية
            </label>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              flexDirection: 'row-reverse'
            }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: colors.primaryAlpha(0.1),
                  color: colors.primaryDark,
                  cursor: 'pointer',
                  fontSize: theme.fonts.size.lg,
                  fontWeight: theme.fonts.weight.bold,
                  transition: 'all 0.2s ease'
                }}
              >
                -
              </button>
              
              <span style={{
                fontSize: theme.fonts.size.xl,
                fontWeight: theme.fonts.weight.bold,
                color: colors.primary,
                minWidth: '3rem',
                textAlign: 'center',
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: colors.primaryAlpha(0.05),
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${colors.primaryAlpha(0.2)}`
              }}>
                {quantity}
              </span>
              
              <button
                type="button"
                onClick={() => {
                  const newQuantity = quantity + 1;
                  if (!product.allowMultipleQuantities || newQuantity <= product.maxQuantityPerInquiry) {
                    setQuantity(newQuantity);
                  }
                }}
                disabled={product.allowMultipleQuantities && quantity >= product.maxQuantityPerInquiry}
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: colors.primaryAlpha(0.1),
                  color: colors.primaryDark,
                  cursor: product.allowMultipleQuantities && quantity >= product.maxQuantityPerInquiry ? 'not-allowed' : 'pointer',
                  opacity: product.allowMultipleQuantities && quantity >= product.maxQuantityPerInquiry ? 0.5 : 1,
                  fontSize: theme.fonts.size.lg,
                  fontWeight: theme.fonts.weight.bold,
                  transition: 'all 0.2s ease'
                }}
              >
                +
              </button>

              {product.allowMultipleQuantities && (
                <span style={{
                  fontSize: theme.fonts.size.sm,
                  color: theme.colors.textSecondary,
                  fontWeight: theme.fonts.weight.medium
                }}>
                  الحد الأقصى: {product.maxQuantityPerInquiry}
                </span>
              )}
            </div>
            {renderFieldError('quantity')}
          </div>
        )}

        {/* Offers Selection */}
        {selectedOrderType === 'offer' && product.offers && product.offers.length > 0 && (
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: theme.fonts.size.lg,
              fontWeight: theme.fonts.weight.semiBold,
              color: hasCustomColors ? colors.primaryLight : theme.colors.text,
              marginBottom: theme.spacing.md
            }}>
              اختر العرض
            </label>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'row', // default
                gap: theme.spacing.md,
                flexWrap: 'wrap',
              }}
            >
              {product.offers
                .filter((offer: IOffer) => offer.isActive)
                .map((offer: IOffer) => (
                  <label
                    key={offer._id}
                    style={getOfferCardStyle(selectedOffer === offer._id)}
                  >
                    <input
                      type="radio"
                      name="offer"
                      value={offer._id}
                      checked={selectedOffer === offer._id}
                      onChange={(e) => setSelectedOffer(e.target.value)}
                      style={{
                        marginTop: '0.25rem',
                        accentColor: colors.primaryLight,
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div
                      className=' max-sm:text-xl text-xl'
                        style={{
                          fontWeight: theme.fonts.weight.bold,
                          color: hasCustomColors
                            ? colors.primaryLight
                            : theme.colors.text,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {offer.title}
                      </div>

                      {offer.description && (
                        <div
                          style={{
                            fontSize: theme.fonts.size.sm,
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.xs,
                          }}
                        >
                          {offer.description}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {offer.originalPrice && (
                          <span
                            style={{
                              fontSize: "15px",
                              color: theme.colors.textMuted,
                              textDecoration: 'line-through',
                            }}
                          >
                            {formatPrice(offer.originalPrice)}
                          </span>
                        )}
                        {offer.discountedPrice && (
                          <span
                          className=' max-sm:text-[15px] text-xl'
                            style={{
                              color: colors.primaryLight,
                              fontWeight: theme.fonts.weight.semiBold,
                            }}
                          >
                            {formatPrice(offer.discountedPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
            </div>

            {renderFieldError('offer')}
          </div>
        )}

        {/* Dynamic Fields - RESPONSIVE FIX */}
        {product.dynamicFields && product.dynamicFields.length > 0 && (
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: theme.fonts.size.lg,
              fontWeight: theme.fonts.weight.semiBold,
              color: "black",
              marginBottom: theme.spacing.md
            }}>
              المعلومات المطلوبة
            </label>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing.md,
              width: '100%'
            }}>
              {product.dynamicFields.map((field: IDynamicField) => (
                <div key={field.key} style={{
                  minWidth: '0', // Prevent overflow on small screens
                  width: '100%'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    fontWeight: theme.fonts.weight.medium,
                    color: "black",
                    marginBottom: theme.spacing.xs,
                    wordBreak: 'break-word'
                  }}>
                    {field.placeholder}
                    {field.isRequired && <span style={{color: theme.colors.error}}> *</span>}
                  </label>
                  
                  {field.key === 'phoneNumber' ? (
                    <div style={{
                      width: '100%',
                      position: 'relative',
                    }}>
                      <AlgerianPhoneInput
                        value={dynamicFields[field.key] || ''}
                        onChange={(value) => handleDynamicFieldChange(field.key, value)}
                        error={validationErrors[field.key]}
                        required={field.isRequired}
                        placeholder={`${field.placeholder}`}
                        hasCustomColors={hasCustomColors}
                        colors={colors}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.75rem, 2vw, 1rem)',
                          border: `2px solid ${
                            validationErrors[field.key]
                              ? theme.colors.error
                              : hasCustomColors
                              ? colors.primaryAlpha(0.2)
                              : theme.colors.border
                          }`,
                          borderRadius: theme.borderRadius.md,
                          backgroundColor: hasCustomColors
                            ? colors.primaryAlpha(0.02)
                            : theme.colors.backgroundSecondary,
                          color: theme.colors.text,
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          direction: 'rtl',
                          transition: 'all 0.2s ease',
                          boxShadow: hasCustomColors
                            ? `0 2px 8px ${colors.primaryAlpha(0.05)}`
                            : 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  ) : field.key === 'wilaya' ? (
                    <WilayaSelect
                      fieldName={field.placeholder}
                      errors={validationErrors}
                      required={field.isRequired}
                      value={dynamicFields[field.key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleDynamicFieldChange(field.key, e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: 'clamp(0.75rem, 2vw, 1rem)',
                        border: `2px solid ${
                          validationErrors[field.key]
                            ? theme.colors.error
                            : hasCustomColors
                            ? colors.primaryAlpha(0.2)
                            : theme.colors.border
                        }`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: hasCustomColors
                          ? colors.primaryAlpha(0.02)
                          : theme.colors.backgroundSecondary,
                        color: theme.colors.text,
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        direction: 'rtl',
                        transition: 'all 0.2s ease',
                        boxShadow: hasCustomColors
                          ? `0 2px 8px ${colors.primaryAlpha(0.05)}`
                          : 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e: any) => {
                        if (hasCustomColors) {
                          e.target.style.borderColor = colors.primary;
                          e.target.style.boxShadow = `0 0 0 3px ${colors.primaryAlpha(0.1)}`;
                        }
                      }}
                      onBlur={(e: any) => {
                        if (hasCustomColors) {
                          e.target.style.borderColor = colors.primaryAlpha(0.2);
                          e.target.style.boxShadow = `0 2px 8px ${colors.primaryAlpha(0.05)}`;
                        }
                      }}
                    />
                  ) : (
                    <input
                      type={getInputType(field.key)}
                      required={field.isRequired}
                      value={dynamicFields[field.key] || ''}
                      onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.75rem, 2vw, 1rem)',
                        border: `2px solid ${
                          validationErrors[field.key] ? theme.colors.error : (hasCustomColors ? colors.primaryAlpha(0.2) : theme.colors.border)
                        }`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: hasCustomColors ? colors.primaryAlpha(0.02) : theme.colors.backgroundSecondary,
                        color: theme.colors.text,
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        direction: field.key === 'email' ? 'ltr' : 'rtl',
                        transition: 'all 0.2s ease',
                        boxShadow: hasCustomColors ? `0 2px 8px ${colors.primaryAlpha(0.05)}` : 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        if (hasCustomColors) {
                          e.currentTarget.style.borderColor = colors.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryAlpha(0.1)}`;
                        }
                      }}
                      onBlur={(e) => {
                        if (hasCustomColors) {
                          e.currentTarget.style.borderColor = colors.primaryAlpha(0.2);
                          e.currentTarget.style.boxShadow = `0 2px 8px ${colors.primaryAlpha(0.05)}`;
                        }
                      }}
                    />
                  )}
                  {renderFieldError(field.key)}
                </div>
              ))}
            </div>

            {/* Responsive CSS for mobile devices */}
            <style>{`
              @media (max-width: 768px) {
                div[style*="gridTemplateColumns: repeat(auto-fit, minmax(300px, 1fr))"] {
                  grid-template-columns: 1fr !important;
                  gap: 1rem !important;
                }
                
                div[style*="gridTemplateColumns: repeat(auto-fit, minmax(300px, 1fr))"] > div {
                  min-width: 100% !important;
                }
                
                label[style*="font-size: clamp"] {
                  font-size: 0.9rem !important;
                }
                
                input, select {
                  font-size: 0.9rem !important;
                  padding: 0.875rem !important;
                }
              }
              
              @media (max-width: 480px) {
                div[style*="gridTemplateColumns: repeat(auto-fit, minmax(300px, 1fr))"] {
                  gap: 0.75rem !important;
                }
                
                label[style*="font-size: clamp"] {
                  font-size: 0.85rem !important;
                }
                
                input, select {
                  font-size: 0.85rem !important;
                  padding: 0.75rem !important;
                }
              }
            `}</style>
          </div>
        )}

        {/* Predefined Fields - Interactive Selection */}
        {product.predefinedFields?.some((field: any) => field.isActive && field.selectedOptions.length > 0) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            border: hasCustomColors 
              ? `1px solid ${colors.primaryAlpha(0.15)}`
              : `1px solid ${theme.colors.border}`
          }}>
            <h3 style={{
              fontSize: theme.fonts.size.lg,
              fontWeight: theme.fonts.weight.bold,
              color: hasCustomColors ? colors.primary : theme.colors.text,
              margin: 0,
              textAlign: 'center',
              paddingBottom: theme.spacing.sm,
              borderBottom: hasCustomColors 
                ? `2px solid ${colors.primaryAlpha(0.2)}`
                : `2px solid ${theme.colors.border}`
            }}>
              خيارات المنتج
            </h3>
            {product.predefinedFields
              .filter((field: any) => field.isActive && field.selectedOptions.length > 0)
              .map((field: any) => (
                <div key={field.category} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.sm
                }}>
                  <label style={{
                    fontSize: theme.fonts.size.md,
                    fontWeight: theme.fonts.weight.semiBold,
                    textTransform: 'capitalize',
                    color: hasCustomColors ? colors.primaryDark : theme.colors.text,
                    marginBottom: theme.spacing.xs,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: hasCustomColors ? colors.primary : theme.colors.primary
                    }} />
                    {field.category === 'sizes' ? 'المقاسات' : 
                     field.category === 'colors' ? 'الألوان' : 
                     field.category === 'materials' ? 'الخامات' : 
                     field.category === 'seasons' ? 'المواسم' : 
                     field.category === 'availability' ? 'التوفر' : field.category}
                    {selectedVariants[field.category] && (
                      <span style={{
                        fontSize: theme.fonts.size.sm,
                        color: hasCustomColors ? colors.primaryLight : theme.colors.primary,
                        fontWeight: theme.fonts.weight.medium,
                        backgroundColor: hasCustomColors ? colors.primaryAlpha(0.1) : `${theme.colors.primary}15`,
                        padding: `2px ${theme.spacing.xs}`,
                        borderRadius: theme.borderRadius.sm
                      }}>
                        ({selectedVariants[field.category]})
                      </span>
                    )}
                  </label>
                  <div style={{
                    display: 'flex',
                    gap: theme.spacing.sm,
                    flexWrap: 'wrap',
                    padding: theme.spacing.sm,
                    backgroundColor: hasCustomColors ? colors.primaryAlpha(0.03) : theme.colors.surface,
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${hasCustomColors ? colors.primaryAlpha(0.1) : theme.colors.border}`
                  }}>
                    {field.selectedOptions.map((option: string) => {
                      const isSelected = selectedVariants[field.category] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleVariantSelection(field.category, option)}
                          style={{
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            border: `2px solid ${isSelected 
                              ? (hasCustomColors ? colors.primary : theme.colors.primary)
                              : (hasCustomColors ? colors.primaryAlpha(0.3) : theme.colors.border)
                            }`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fonts.size.sm,
                            fontWeight: isSelected ? theme.fonts.weight.bold : theme.fonts.weight.medium,
                            textTransform: 'capitalize',
                            backgroundColor: isSelected 
                              ? (hasCustomColors ? colors.primaryAlpha(0.15) : `${theme.colors.primary}15`)
                              : (hasCustomColors ? colors.primaryAlpha(0.05) : theme.colors.backgroundSecondary),
                            color: isSelected 
                              ? (hasCustomColors ? colors.primaryDark : theme.colors.primary)
                              : theme.colors.text,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            minWidth: '60px',
                            textAlign: 'center',
                            boxShadow: isSelected 
                              ? (hasCustomColors ? `0 4px 12px ${colors.primaryAlpha(0.25)}` : `0 4px 12px ${theme.colors.primary}25`)
                              : 'none',
                            transform: isSelected ? 'translateY(-1px)' : 'translateY(0)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = hasCustomColors ? colors.primaryAlpha(0.08) : `${theme.colors.primary}08`;
                              e.currentTarget.style.borderColor = hasCustomColors ? colors.primaryAlpha(0.5) : `${theme.colors.primary}80`;
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = hasCustomColors ? `0 2px 8px ${colors.primaryAlpha(0.15)}` : `0 2px 8px ${theme.colors.primary}15`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = hasCustomColors ? colors.primaryAlpha(0.05) : theme.colors.backgroundSecondary;
                              e.currentTarget.style.borderColor = hasCustomColors ? colors.primaryAlpha(0.3) : theme.colors.border;
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        >
                          {isSelected && (
                            <span style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: hasCustomColors ? colors.primary : theme.colors.primary,
                              boxShadow: '0 0 0 2px white'
                            }} />
                          )}
                          {option === 'S' || option === 'M' || option === 'L' || option === 'XL' || option === 'XXL' ? option :
                           option === 'red' ? 'أحمر' :
                           option === 'blue' ? 'أزرق' :
                           option === 'black' ? 'أسود' :
                           option === 'white' ? 'أبيض' :
                           option === 'green' ? 'أخضر' :
                           option === 'summer' ? 'صيف' :
                           option === 'winter' ? 'شتاء' :
                           option === 'spring' ? 'ربيع' :
                           option === 'autumn' ? 'خريف' :
                           option === 'wool' ? 'صوف' :
                           option === 'cotton' ? 'قطن' :
                           option === 'fleece' ? 'فرو' :
                           option === 'down' ? 'ريش' :
                           option === 'in stock' ? 'متوفر' :
                           option === 'out of stock' ? 'غير متوفر' :
                           option === 'discounted' ? 'مخفض' :
                           option === 'coming soon' ? 'قريباً' : option}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Selection indicator */}
                  {!selectedVariants[field.category] && (
                    <div style={{
                      fontSize: theme.fonts.size.xs,
                      color: theme.colors.textSecondary,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      padding: theme.spacing.xs
                    }}>
                      اختر خياراً واحداً
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Global Error Display */}
        {(validationErrors.submit || errors.length > 0) && (
          <div style={{
            padding: theme.spacing.md,
            backgroundColor: `${theme.colors.error}15`,
            border: `1px solid ${theme.colors.error}`,
            borderRadius: theme.borderRadius.md,
            color: theme.colors.error,
            marginBottom: theme.spacing.lg,
            textAlign: 'center',
            fontSize: theme.fonts.size.md,
            fontWeight: theme.fonts.weight.medium
          }}>
            {validationErrors.submit || 'يرجى تصحيح الأخطاء المذكورة أعلاه'}
          </div>
        )}
         
        {/* Total Price and Submit */}
        <div style={{
          padding: theme.spacing.lg,
          background: hasCustomColors 
            ? `linear-gradient(135deg, ${colors.primaryAlpha(0.08)} 0%, ${colors.primaryAlpha(0.03)} 100%)`
            : theme.colors.backgroundSecondary,
          borderRadius: theme.borderRadius.md,
          border: hasCustomColors 
            ? `2px solid ${colors.primaryAlpha(0.15)}`
            : `1px solid ${theme.colors.border}`,
          marginBottom: theme.spacing.lg,
          boxShadow: hasCustomColors ? `0 4px 15px ${colors.primaryAlpha(0.1)}` : 'none'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: theme.fonts.size.xl,
            fontWeight: theme.fonts.weight.bold,
            color: "black"
          }}>
            <span>المبلغ الإجمالي:</span>
            <span style={{ color: colors.primary }}>{formatPrice(calculateTotalPrice())}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isFormSubmitting || isSubmitting || isLoadingFingerprint}
          style={{
            width: '100%',
            padding: theme.spacing.lg,
            background: (isFormSubmitting || isSubmitting || isLoadingFingerprint) 
              ? theme.colors.textMuted 
              : (hasCustomColors 
                ? `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryDark}80 100%)`
                : theme.colors.gradientPrimary),
            color: theme.colors.textOnPrimary,
            border: 'none',
            borderRadius: theme.borderRadius.lg,
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.bold,
            cursor: (isFormSubmitting || isSubmitting || isLoadingFingerprint) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            opacity: (isFormSubmitting || isSubmitting || isLoadingFingerprint) ? 0.7 : 1,
            boxShadow: hasCustomColors 
              ? `0 8px 25px ${colors.primaryDark}40`
              : theme.shadows.lg
          }}
          onMouseEnter={(e) => {
            if (!isFormSubmitting && !isSubmitting && !isLoadingFingerprint) {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = hasCustomColors 
                ? `0 12px 30px ${colors.primaryDark}60`
                : theme.shadows.xl;
            }
          }}
          onMouseLeave={(e) => {
            if (!isFormSubmitting && !isSubmitting && !isLoadingFingerprint) {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = hasCustomColors 
                ? `0 8px 25px ${colors.primaryDark}40`
                : theme.shadows.lg;
            }
          }}
        >
          {isLoadingFingerprint ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: `2px solid ${theme.colors.textOnPrimary}`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              جاري التحقق...
            </>
          ) : (isFormSubmitting || isSubmitting) ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: `2px solid ${theme.colors.textOnPrimary}`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              جاري الإرسال...
            </>
          ) : (
            `تأكيد الطلب - ${formatPrice(calculateTotalPrice())}`
          )}
        </button>
      </form>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OrderForm;