import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IDynamicField, IHiddenField, IOffer, IProduct } from '../types/product';
import { formatAlgerianPhone, validateAlgerianPhone, type CreateOrderInquiry } from '../types/orderInquiry';
import type { ValidationError } from '../hooks/useOrderInquiry';
import type { Theme } from '../types/theme';
import { AlgerianPhoneInput } from './AlgerianPhoneInput';
import { WilayaSelect } from './WilayaInput';

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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Get dynamic colors based on product colors or theme
  const getColors = () => {
    if (hasCustomColors && productColors) {
      return {
        primary: productColors.primary,
        primaryLight: productColors.primaryLight,
        primaryDark: productColors.primaryDark,
        primaryAlpha: (alpha: number) => `${productColors.primary}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsFormSubmitting(true);
    setValidationErrors({});

    try {
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
        selectedVariants: processedFields,
        totalPrice: calculateTotalPrice()
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setValidationErrors({
        submit: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
      });
    } finally {
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
    padding: theme.spacing.xl,
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
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    border: `2px solid ${isSelected ? colors.primary : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: isSelected 
      ? colors.primaryAlpha(0.1)
      : theme.colors.backgroundSecondary,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isSelected 
      ? `0 6px 20px ${colors.primaryAlpha(0.15)}`
      : theme.shadows.sm
  });

  return (
    <div style={containerStyle}>      
      <form onSubmit={handleSubmit}>
          {product.hiddenFields?.map((field: IHiddenField) => (
          <input
            key={field.key}
            type="hidden"
            name={field.key}
            value={field.value}
          />
        ))}

        {/* Order Type Selection */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <label style={{
            display: 'block',
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.semiBold,
            color: hasCustomColors ? colors.primaryDark : theme.colors.text,
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
              color: hasCustomColors ? colors.primaryDark : theme.colors.text,
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
              color: hasCustomColors ? colors.primaryDark : theme.colors.text,
              marginBottom: theme.spacing.md
            }}>
              اختر العرض
            </label>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md
            }}>
              {product.offers.filter((offer: IOffer) => offer.isActive).map((offer: IOffer) => (
                <label key={offer._id} style={getOfferCardStyle(selectedOffer === offer._id)}>
                  <input
                    type="radio"
                    name="offer"
                    value={offer._id}
                    checked={selectedOffer === offer._id}
                    onChange={(e) => setSelectedOffer(e.target.value)}
                    style={{ 
                      marginTop: '0.25rem',
                      accentColor: colors.primary
                    }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: theme.fonts.size.md,
                      fontWeight: theme.fonts.weight.bold,
                      color: hasCustomColors ? colors.primaryDark : theme.colors.text,
                      marginBottom: theme.spacing.xs
                    }}>
                      {offer.title}
                    </div>
                    
                    {offer.description && (
                      <div style={{
                        fontSize: theme.fonts.size.sm,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing.xs
                      }}>
                        {offer.description}
                      </div>
                    )}
                    
                    <div style={{
                      display: 'flex',
                      gap: theme.spacing.md,
                      alignItems: 'center',
                      marginBottom: theme.spacing.xs
                    }}>
                      {offer.originalPrice && (
                        <span style={{
                          fontSize: theme.fonts.size.sm,
                          color: theme.colors.textMuted,
                          textDecoration: 'line-through'
                        }}>
                          {formatPrice(offer.originalPrice)}
                        </span>
                      )}
                      {offer.discountedPrice && (
                        <span style={{
                          fontSize: theme.fonts.size.lg,
                          color: colors.primary,
                          fontWeight: theme.fonts.weight.semiBold
                        }}>
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

        {/* Dynamic Fields */}
        {product.dynamicFields && product.dynamicFields.length > 0 && (
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: theme.fonts.size.lg,
              fontWeight: theme.fonts.weight.semiBold,
              color: hasCustomColors ? colors.primaryDark : theme.colors.text,
              marginBottom: theme.spacing.md
            }}>
              المعلومات المطلوبة
            </label>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md
            }}>
              {product.dynamicFields.map((field: IDynamicField) => (
                <div key={field.key}>
                  <label style={{
                    display: 'block',
                    fontSize: theme.fonts.size.md,
                    fontWeight: theme.fonts.weight.medium,
                    color: hasCustomColors ? colors.primaryDark : theme.colors.text,
                    marginBottom: theme.spacing.xs
                  }}>
                    {field.placeholder}
                    {field.isRequired && <span style={{color: theme.colors.error}}> *</span>}
                  </label>
                  
                  {field.key === 'phoneNumber' ? (
                <div
                  style={{
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <AlgerianPhoneInput
                    value={dynamicFields[field.key] || ''}
                    onChange={(value) => handleDynamicFieldChange(field.key, value)}
                    error={validationErrors[field.key]}
                    required={field.isRequired}
                    placeholder={`أدخل ${field.placeholder}`}
                    hasCustomColors={hasCustomColors}
                    colors={colors}
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
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
                      fontSize: theme.fonts.size.md,
                      direction: 'rtl',
                      transition: 'all 0.2s ease',
                      boxShadow: hasCustomColors
                        ? `0 2px 8px ${colors.primaryAlpha(0.05)}`
                        : 'none',
                    }}
                  />
                </div>
              ) : field.key === 'wilaya' ? (
                <WilayaSelect
                  fieldName={field.key}
                  errors={validationErrors}
                  required={field.isRequired}
                  value={dynamicFields[field.key] || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleDynamicFieldChange(field.key, e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
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
                    fontSize: theme.fonts.size.md,
                    direction: 'rtl',
                    transition: 'all 0.2s ease',
                    boxShadow: hasCustomColors
                      ? `0 2px 8px ${colors.primaryAlpha(0.05)}`
                      : 'none',
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
                        padding: theme.spacing.md,
                        border: `2px solid ${
                          validationErrors[field.key] ? theme.colors.error : (hasCustomColors ? colors.primaryAlpha(0.2) : theme.colors.border)
                        }`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: hasCustomColors ? colors.primaryAlpha(0.02) : theme.colors.backgroundSecondary,
                        color: theme.colors.text,
                        fontSize: theme.fonts.size.md,
                        direction: field.key === 'email' ? 'ltr' : 'rtl',
                        transition: 'all 0.2s ease',
                        boxShadow: hasCustomColors ? `0 2px 8px ${colors.primaryAlpha(0.05)}` : 'none'
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
            color: hasCustomColors ? colors.primaryDark : theme.colors.text
          }}>
            <span>المبلغ الإجمالي:</span>
            <span style={{ color: colors.primary }}>{formatPrice(calculateTotalPrice())}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isFormSubmitting || isSubmitting}
          style={{
            width: '100%',
            padding: theme.spacing.lg,
            background: (isFormSubmitting || isSubmitting) 
              ? theme.colors.textMuted 
              : (hasCustomColors 
                ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
                : theme.colors.gradientPrimary),
            color: theme.colors.textOnPrimary,
            border: 'none',
            borderRadius: theme.borderRadius.lg,
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.bold,
            cursor: (isFormSubmitting || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            opacity: (isFormSubmitting || isSubmitting) ? 0.7 : 1,
            boxShadow: hasCustomColors 
              ? `0 8px 25px ${colors.primaryAlpha(0.3)}`
              : theme.shadows.lg
          }}
          onMouseEnter={(e) => {
            if (!isFormSubmitting && !isSubmitting) {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = hasCustomColors 
                ? `0 12px 30px ${colors.primaryAlpha(0.4)}`
                : theme.shadows.xl;
            }
          }}
          onMouseLeave={(e) => {
            if (!isFormSubmitting && !isSubmitting) {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = hasCustomColors 
                ? `0 8px 25px ${colors.primaryAlpha(0.3)}`
                : theme.shadows.lg;
            }
          }}
        >
          {(isFormSubmitting || isSubmitting) ? (
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