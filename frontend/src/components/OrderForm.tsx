import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IDynamicField, IOffer, IProduct } from '../types/product';
import { formatAlgerianPhone, validateAlgerianPhone, type CreateOrderInquiry } from '../types/orderInquiry';
import type { ValidationError } from '../hooks/useOrderInquiry';
import { AlgerianPhoneInput } from './AlgerianPhoneInput';
import { WilayaSelect } from './WilayaInput';

interface ProductFormProps {
  product: IProduct;
  onSubmit: (formData: CreateOrderInquiry) => Promise<void>;
  errors?: ValidationError[] ;
  isSubmitting?: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

const OrderForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  errors = [], 
  isSubmitting = false 
}) => {
  const { theme } = useTheme();
  const [selectedOrderType, setSelectedOrderType] = useState<'offer' | 'quantity'>('quantity');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

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
    const error = validationErrors[fieldKey] || errors.find(item=>item.field = fieldKey)?.message;
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

  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      direction: 'rtl',
      textAlign: 'right'
    }}>
      <form onSubmit={handleSubmit}>
        {/* Order Type Selection */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <label style={{
            display: 'block',
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.semiBold,
            color: theme.colors.text,
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
                style={{
                  flex: 1,
                  padding: theme.spacing.lg,
                  border: `2px solid ${
                    selectedOrderType === 'quantity' ? theme.colors.primary : theme.colors.border
                  }`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: selectedOrderType === 'quantity' 
                    ? `${theme.colors.primary}15` 
                    : 'transparent',
                  color: theme.colors.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: theme.fonts.size.md,
                  fontWeight: theme.fonts.weight.medium
                }}
              >
                الطلب بالكمية
              </button>
            )}

            {/* Offer Option */}
            {product.offers && product.offers.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedOrderType('offer')}
                style={{
                  flex: 1,
                  padding: theme.spacing.lg,
                  border: `2px solid ${
                    selectedOrderType === 'offer' ? theme.colors.primary : theme.colors.border
                  }`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: selectedOrderType === 'offer' 
                    ? `${theme.colors.primary}15` 
                    : 'transparent',
                  color: theme.colors.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: theme.fonts.size.md,
                  fontWeight: theme.fonts.weight.medium
                }}
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
              color: theme.colors.text,
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
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  cursor: 'pointer',
                  fontSize: theme.fonts.size.lg,
                  fontWeight: theme.fonts.weight.bold
                }}
              >
                -
              </button>
              
              <span style={{
                fontSize: theme.fonts.size.xl,
                fontWeight: theme.fonts.weight.bold,
                color: theme.colors.text,
                minWidth: '3rem',
                textAlign: 'center'
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
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  cursor: product.allowMultipleQuantities && quantity >= product.maxQuantityPerInquiry ? 'not-allowed' : 'pointer',
                  opacity: product.allowMultipleQuantities && quantity >= product.maxQuantityPerInquiry ? 0.5 : 1,
                  fontSize: theme.fonts.size.lg,
                  fontWeight: theme.fonts.weight.bold
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
              color: theme.colors.text,
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
                <label key={offer._id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: theme.spacing.md,
                  padding: theme.spacing.lg,
                  border: `2px solid ${
                    selectedOffer === offer._id ? theme.colors.primary : theme.colors.border
                  }`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: selectedOffer === offer._id 
                    ? `${theme.colors.primary}15` 
                    : theme.colors.backgroundSecondary,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="offer"
                    value={offer._id}
                    checked={selectedOffer === offer._id}
                    onChange={(e) => setSelectedOffer(e.target.value)}
                    style={{ marginTop: '0.25rem' }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: theme.fonts.size.md,
                      fontWeight: theme.fonts.weight.bold,
                      color: theme.colors.text,
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
                          color: theme.colors.primary,
                          fontWeight: theme.fonts.weight.semiBold
                        }}>
                          {formatPrice(offer.discountedPrice)}
                        </span>
                      )}
                    </div>
                    
                    {offer.validUntil && (
                      <div style={{
                        fontSize: theme.fonts.size.xs,
                        color: theme.colors.textMuted,
                        marginTop: theme.spacing.xs
                      }}>
                        صالح حتى: {new Date(offer.validUntil).toLocaleDateString('ar-DZ')}
                      </div>
                    )}
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
              color: theme.colors.text,
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
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs
                  }}>
                    {field.placeholder}
                    {field.isRequired && <span style={{color: theme.colors.error}}> *</span>}
                  </label>
                  
                  {/* Special handling for phone field */}
                  {field.key === 'phoneNumber' ? (
                    <AlgerianPhoneInput
                      value={dynamicFields[field.key] || ''}
                      onChange={(value) => handleDynamicFieldChange(field.key, value)}
                      error={validationErrors[field.key]?.[0]}
                      required={field.isRequired}
                      placeholder={`أدخل ${field.placeholder}`}
                    />
                  ) : field.key === 'wilaya' ? (
                    <WilayaSelect
                      fieldName={field.key}
                      errors={validationErrors}
                      required={field.isRequired}
                      value={dynamicFields[field.key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        handleDynamicFieldChange(field.key, e.target.value)
                      }
                    />
                  ) : (
                    <input
                      type={getInputType(field.key)}
                      required={field.isRequired}
                      value={dynamicFields[field.key] || ''}
                      onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
                      placeholder={`أدخل ${field.placeholder}`}
                      style={{
                        width: '100%',
                        padding: theme.spacing.md,
                        border: `1px solid ${
                          validationErrors[field.key] ? theme.colors.error : theme.colors.border
                        }`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.backgroundSecondary,
                        color: theme.colors.text,
                        fontSize: theme.fonts.size.md,
                        direction: field.key === 'email' ? 'ltr' : 'rtl'
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
        {(validationErrors.submit ||  errors.length > 0) && (
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
            {validationErrors.submit || errors.length > 0}
          </div>
        )}

        {/* Total Price and Submit */}
        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border}`,
          marginBottom: theme.spacing.lg
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: theme.fonts.size.xl,
            fontWeight: theme.fonts.weight.bold,
            color: theme.colors.text
          }}>
            <span>المبلغ الإجمالي:</span>
            <span>{formatPrice(calculateTotalPrice())}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isFormSubmitting || isSubmitting}
          style={{
            width: '100%',
            padding: theme.spacing.lg,
            backgroundColor: (isFormSubmitting || isSubmitting) 
              ? theme.colors.textMuted 
              : theme.colors.primary,
            color: theme.colors.textOnPrimary,
            border: 'none',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.bold,
            cursor: (isFormSubmitting || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            opacity: (isFormSubmitting || isSubmitting) ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isFormSubmitting && !isSubmitting) {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isFormSubmitting && !isSubmitting) {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
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