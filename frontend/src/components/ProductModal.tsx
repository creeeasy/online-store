import React from 'react';
import Modal from './Modal';
import ProductForm from './ProductForm';
import type { IProduct } from '../types/product';
import type { PREDEFINED_CATEGORIES } from '../data/predefinedFields';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { closeModal } from '../store/slices/modalSlice';

interface ProductModalProps {
  onCreate: (productData: Partial<IProduct>) => Promise<void>;
  onSave: (id: string, productData: Partial<IProduct>) => Promise<void>;
  predefinedCategories: typeof PREDEFINED_CATEGORIES;
  isLoading?: boolean;
  validationErrors?: Record<string, string[]>;
  createProductData?: Partial<IProduct>; // Add this prop to receive form data from parent
}

const ProductModal: React.FC<ProductModalProps> = ({
  onCreate,
  onSave,
  isLoading = false,
  validationErrors = {},
  createProductData = {}, // Default to empty object
}) => {
  const dispatch = useAppDispatch();
  const { isOpen, modalType, product } = useAppSelector((state) => state.modal);

  if (!isOpen || (modalType !== 'createProduct' && modalType !== 'editProduct')) {
    return null;
  }

  const isCreating = modalType === 'createProduct';

  const handleSubmit = async (productData: Partial<IProduct>) => {
    if (isCreating) {
      await onCreate(productData);
    } else if (product && product._id) {
      await onSave(product._id, productData);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  // Use createProductData for creation mode, product for edit mode
  const productData = isCreating ? createProductData : (product ?? {});

  return (
    <Modal>
      <ProductForm
        product={productData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={!isCreating}
        isLoading={isLoading}
        validationErrors={validationErrors}
      />
    </Modal>
  );
};

export default ProductModal;