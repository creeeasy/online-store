import React from 'react';
import Modal from './Modal';
import ProductForm from './ProductForm';
import type { IProduct } from '../types/product';
import type { PREDEFINED_CATEGORIES } from '../data/predefinedFields';

interface ProductModalProps {
  isOpen: boolean;
  isLoading:boolean;
  onClose: () => void;
  product: IProduct | null;
  onSave: (id: string, productData: Partial<IProduct>) => Promise<void>;
   validationErrors?: Record<string, string[]>;
  predefinedCategories: typeof PREDEFINED_CATEGORIES;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  onSave,
  isLoading,
    validationErrors = {},
}) => {
  const handleSubmit = async (productData: Partial<IProduct>) => {
    if (product) {
      await onSave(product._id, productData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ProductForm
        product={product ?? {}}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isEditing={!!product}
        isLoading={isLoading}
        validationErrors={validationErrors}
      />
    </Modal>
  );
};

export default ProductModal;