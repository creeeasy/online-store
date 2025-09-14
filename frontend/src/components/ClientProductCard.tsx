import React from 'react';
import { FiGift, FiEye } from 'react-icons/fi';
import type { IProduct } from '../types/product';

interface ClientProductCardProps {
  product: IProduct;
  onViewDetails: (product: IProduct) => void;
}

const ClientProductCard: React.FC<ClientProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images[0] || 'https://picsum.photos/300/300?random=default'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.discountPrice && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              SALE
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`font-bold text-xl ${
              product.discountPrice ? 'text-red-500' : 'text-gray-800'
            }`}
          >
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-gray-400 line-through text-sm">
              ${product.price}
            </span>
          )}
        </div>

        {/* Offers */}
        {product.offers && product.offers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FiGift size={16} className="text-green-500" />
            <span>
              {product.offers.length} special offer
              {product.offers.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <FiEye size={16} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientProductCard;