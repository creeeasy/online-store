import React from 'react';
import Modal from './Modal';
import ProductForm from './ProductForm';
import type { IProduct } from '../types/product';
import type { PREDEFINED_CATEGORIES } from '../data/predefinedFields';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { closeModal } from '../store/slices/modalSlice';

interface ProductModalProps {
  onSave: (id: string, productData: Partial<IProduct>) => Promise<void>;
  predefinedCategories: typeof PREDEFINED_CATEGORIES;
  isLoading?: boolean;
  validationErrors?: Record<string, string[]>;
}

const ProductModal: React.FC<ProductModalProps> = ({
  onSave,
  isLoading = false,
  validationErrors = {},
}) => {
  const dispatch = useAppDispatch();
  const { isOpen, product } = useAppSelector((state) => state.modal);

  if (!isOpen) return null;

  const handleSubmit = async (productData: Partial<IProduct>) => {
    if (product && product._id) {
      await onSave(product._id, productData);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <Modal>
      <ProductForm
        product={product ?? {}}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={!!product}
        isLoading={isLoading}
        validationErrors={validationErrors}
      />
    </Modal>
  );
};

export default ProductModal;
