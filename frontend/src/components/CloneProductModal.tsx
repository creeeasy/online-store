import React, { useState } from 'react';
import { FiCopy, FiX } from 'react-icons/fi';
import type { IProduct } from '../types/product';

interface CloneProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct | null;
  onConfirm: (reference?: string) => void;
  isLoading?: boolean;
}

const CloneProductModal: React.FC<CloneProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading = false
}) => {
  const [reference, setReference] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reference || undefined);
  };

  const handleClose = () => {
    setReference('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiCopy className="text-green-600" />
            Clone Product
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Create a copy of <strong>"{product.name}"</strong>. The new product will have "(Copy)" appended to its name.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Original Product Details:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Price: ${product.price}</p>
                {product.discountPrice && <p>Discount: ${product.discountPrice}</p>}
                {product.offers && product.offers.length > 0 && (
                  <p>Offers: {product.offers.length}</p>
                )}
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Source (Optional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., facebook, tiktok, instagram"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Track where this cloned product came from
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCopy size={16} />
              {isLoading ? 'Cloning...' : 'Clone Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloneProductModal;