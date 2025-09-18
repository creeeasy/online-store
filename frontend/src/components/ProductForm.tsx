// src/components/ProductForm/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import type { IProduct } from '../types/product';
import { PREDEFINED_CATEGORIES } from '../data/predefinedFields';
import BasicInfoTab from './BasicInfoTab';
import ProductFormTabs from './ProductFormTabs';
import OffersTab from './OffersTab';
import PredefinedTab from './PredefinedTab';
import DynamicFieldsTab from './DynamicFieldsTab';
import HiddenFieldsTab from './HiddenFieldsTab';

interface ProductFormProps {
  product: Partial<IProduct>;
  onSubmit: (productData: Partial<IProduct>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  validationErrors?: Record<string, string[]>;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading,
  validationErrors = {},
  isEditing = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '',
    price: 0,
    discountPrice: undefined,
    description: '',
    images: [''],
    dynamicFields: [],
    predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
      category,
      options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
      selectedOptions: [],
      isActive: false
    })),
    offers: [],
    hiddenFields: [],
    reference: '',
    ...product
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Reset form when product changes
  useEffect(() => {
    // ... same useEffect logic as before
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleInputChange = (field: keyof IProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const commonProps = {
    formData,
    setFormData,
    validationErrors,
    handleInputChange,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <ProductFormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {activeTab === 'basic' && <BasicInfoTab {...commonProps} />}
        {activeTab === 'predefined' && <PredefinedTab {...commonProps} />}
        {activeTab === 'offers' && <OffersTab {...commonProps} />}
        {activeTab === 'hidden' && <HiddenFieldsTab {...commonProps} />}
        {activeTab === 'dynamic' && <DynamicFieldsTab {...commonProps} />}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FiSave size={18} />
                {isEditing ? 'Update' : 'Save'} Product
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;