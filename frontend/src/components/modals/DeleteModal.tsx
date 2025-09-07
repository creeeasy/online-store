// components/modals/DeleteModal.tsx
import React, { useState } from 'react';
import { FiAlertTriangle, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import Modal from './Modal';
import type { Product } from '../../types/types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (id: string) => Promise<void>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, product, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(product._id);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setIsDeleting(false);
      }, 1500);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      {isSuccess ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Product Deleted!</h3>
          <p className="text-gray-600">The product has been successfully removed.</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FiAlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Delete Product</h2>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          {/* Product Preview */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={product.images[0] || 'https://picsum.photos/80/80?random=default'}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <p className="text-red-600 font-bold mt-1">${product.price}</p>
              </div>
            </div>
          </div>

          {/* Impact Assessment */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-2">Impact Assessment</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• This product has {product.dynamicFields.length} custom fields</li>
              <li>• {product.predefinedFields.filter(f => f.isActive).length} predefined fields will be removed</li>
              <li>• {product.offers.length} associated offers will be deleted</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2" />
                  Delete Product
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteModal;