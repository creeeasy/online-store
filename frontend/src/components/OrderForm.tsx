import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FiGift, FiTag, FiCheck } from 'react-icons/fi';
import { WilayaSelect } from './WilayaInput';
import type { ValidationError } from '../hooks/useOrderInquiry';
import type { IOffer } from '../types/product';

interface OrderFormProps {
  product: any;
  productColors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
  };
  showOffers: boolean;
  showQuantity: boolean;
  showBothSections: boolean;
  activeOffers: IOffer[];
  selectedOfferId?: string;
  quantity: number;
  customerData: Record<string, any>;
  fieldErrors: Record<string, string>;
  validationErrors: ValidationError[] | undefined;
  selectedVariants: Record<string, string>;
  isSubmitting: boolean;
  onOfferSelect: (offerId: string | null) => void;
  onQuantityChange: (quantity: number) => void;
  onCustomerDataChange: (field: string, value: string) => void;
  onVariantChange: (category: string, value: string) => void;
  onSubmit: () => void;
  calculateTotalPrice: () => number;
  getOfferDiscountText: (offer: any) => string;
  getDaysRemaining: (validUntil: Date) => number;
  getCustomerDataFields: () => any[];
  getHiddenFieldsDataAttributes: () => Record<string, string>;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  product,
  productColors,
  showOffers,
  showQuantity,
  showBothSections,
  activeOffers,
  selectedOfferId,
  quantity,
  customerData,
  fieldErrors,
  validationErrors = [],
  selectedVariants,
  isSubmitting,
  onOfferSelect,
  onQuantityChange,
  onCustomerDataChange,
  onVariantChange,
  onSubmit,
  calculateTotalPrice,
  getOfferDiscountText,
  getDaysRemaining,
  getCustomerDataFields,
  getHiddenFieldsDataAttributes
}) => {
  const { theme } = useTheme();

  if (!showOffers && !showQuantity) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Offers Section */}
      {showOffers && (
        <div className="flex flex-col border p-4" style={{ background: theme.colors.surface }}>
          <div 
            className="flex items-center gap-2 p-2" 
            style={{ background: selectedOfferId ? productColors.primaryDark : productColors.primary, color: theme.colors.textOnPrimary }}
          >
            <FiGift />
            <h2 className="text-lg font-bold">Special Offers</h2>
            <span className="px-2 py-1 bg-white bg-opacity-20 rounded text-sm">
              {activeOffers.length} Active
            </span>
          </div>

          <div className="flex flex-row gap-2 mt-2 flex-wrap">
            {activeOffers.map((offer, index) => {
              const isSelected = selectedOfferId === offer._id;

              return (
                <div
                  key={offer._id || `offer-${index}`}
                  className={`relative flex flex-col p-3 border rounded cursor-pointer transition-all duration-200
                    ${isSelected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-300 hover:bg-gray-50'}
                  `}
                  onClick={() => onOfferSelect(isSelected ? null : offer._id!)}
                >
                  {/* Checkmark for selected offer */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <FiCheck size={12} />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
                      style={{
                        background: isSelected ? productColors.primaryDark : productColors.primary,
                        color: theme.colors.textOnPrimary,
                      }}
                    >
                      <FiTag size={12} />
                    </div>

                    <div>
                      <h3 className="font-medium" style={{ color: theme.colors.text }}>
                        {offer.title}
                      </h3>

                      {/* Show before/after price */}
                      {offer.originalPrice && offer.discountedPrice ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm line-through text-gray-400">
                            DZD {offer.originalPrice}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            DZD {offer.discountedPrice}
                          </span>
                        </div>
                      ) : offer.discountedPrice ? (
                        <span className="text-sm font-bold text-green-600 mt-1">
                          DZD {offer.discountedPrice}
                        </span>
                      ) : offer.originalPrice ? (
                        <span className="text-sm font-bold text-gray-800 mt-1">
                          DZD {offer.originalPrice}
                        </span>
                      ) : null}

                    </div>
                  </div>

                  {offer.description && (
                    <p className="text-sm mt-2" style={{ color: theme.colors.textSecondary }}>
                      {offer.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Section */}
      {showQuantity && (
        <div className="flex flex-col border p-4" style={{ background: theme.colors.surface }}>
          <div 
            className="p-2" 
            style={{ background: quantity > 1 && !selectedOfferId ? productColors.primaryDark : productColors.primary, color: theme.colors.textOnPrimary }}
          >
            <h2 className="text-lg font-bold">Quantity Selection</h2>
          </div>

          <div className="flex flex-col p-3 mt-2 bg-gray-50 rounded">
            <h3 className="font-medium mb-2" style={{ color: theme.colors.text }}>
              {product.allowMultipleQuantities ? 'Select Quantity' : 'Single Item'}
            </h3>

            {product.allowMultipleQuantities ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={!!selectedOfferId || quantity <= 1}
                  className="w-8 h-8 border rounded disabled:opacity-50"
                >
                  −
                </button>
                <span className="text-lg font-bold">{quantity}</span>
                <button 
                  onClick={() => onQuantityChange(quantity + 1)}
                  disabled={!!selectedOfferId || quantity >= (product.maxQuantityPerInquiry || 10)}
                  className="w-8 h-8 border rounded disabled:opacity-50"
                >
                  +
                </button>
                {product.maxQuantityPerInquiry && (
                  <span className="text-sm text-gray-600">Max: {product.maxQuantityPerInquiry}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 rounded flex items-center justify-center">
                  {!selectedOfferId && <FiCheck size={8} className="text-blue-600" />}
                </div>
                <span className={!selectedOfferId ? 'text-blue-600' : 'text-gray-600'}>1 item</span>
              </div>
            )}

            <div className="mt-2 text-lg font-bold text-blue-600">
              Total: DZD {calculateTotalPrice()}
            </div>
          </div>
        </div>
      )}

      {/* Customer Form Section */}
      <div className="flex flex-col border p-4" style={{ background: theme.colors.surface }} {...getHiddenFieldsDataAttributes()}>
        <div className="p-2" style={{ background: productColors.primary, color: theme.colors.textOnPrimary }}>
          <h2 className="text-lg font-bold">Order Inquiry</h2>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {(Object.keys(fieldErrors).length > 0 || validationErrors.length > 0) && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded">
              <h4 className="font-medium mb-1">Errors:</h4>
              <ul className="list-disc list-inside text-sm">
                {Object.entries(fieldErrors).map(([field, error], index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.map((error, index) => (
                  <li key={`val-${index}`}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          {getCustomerDataFields().map((field) => (
            <div key={field.key} className="flex flex-col">
              {field.key === "wilaya" ? (
                <WilayaSelect
                  fieldName={field.key}
                  value={customerData[field.key] || ''}
                  onChange={(e) => onCustomerDataChange(field.key, e.target.value)}
                  required={field.isRequired}
                  errors={fieldErrors[field.key] ? { [field.key]: [fieldErrors[field.key]] } : {}}
                />
              ) : (
                <>
                  <label className="text-sm font-medium">
                    {field.placeholder} {field.isRequired && '*'}
                  </label>
                  <input
                    type="text"
                    value={customerData[field.key] || ''}
                    onChange={(e) => onCustomerDataChange(field.key, e.target.value)}
                    className="p-2 border rounded w-full"
                    style={{ borderColor: fieldErrors[field.key] ? theme.colors.error : theme.colors.border }}
                    placeholder={field.placeholder}
                  />
                </>
              )}
              {fieldErrors[field.key] && (
                <p className="text-sm text-red-600">{fieldErrors[field.key]}</p>
              )}
            </div>
          ))}

          {product.predefinedFields?.some((field: any) => field.isActive && field.selectedOptions.length > 0) && (
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Product Options</h3>
              {product.predefinedFields
                .filter((field: any) => field.isActive && field.selectedOptions.length > 0)
                .map((field: any) => (
                  <div key={field.category} className="flex flex-col">
                    <label className="text-sm font-medium capitalize">{field.category}</label>
                    <div className="flex gap-2">
                      {field.selectedOptions.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => onVariantChange(field.category, option)}
                          className={`px-2 py-1 border rounded text-sm capitalize ${
                            selectedVariants[field.category] === option ? 'bg-blue-500 text-white' : 'bg-white'
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

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="p-2 mt-4 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
          style={{ background: productColors.primary }}
        >
          {isSubmitting ? 'Submitting...' : `Submit Inquiry DZD ${calculateTotalPrice()}`}
        </button>

        </div>
      </div>
    </div>
  );
};
