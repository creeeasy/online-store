import React from 'react';
import { FiEdit, FiTrash2, FiCheck, FiGift } from 'react-icons/fi';
import type { IProduct } from '../types/product';

interface ProductCardProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images[0] || 'https://picsum.photos/300/300?random=default'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-600 rounded-lg shadow-lg transition-all duration-200"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 rounded-lg shadow-lg transition-all duration-200"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
        
        {product.discountPrice && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              SALE
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`font-bold text-xl ${
            product.discountPrice ? 'text-red-500' : 'text-gray-800'
          }`}>
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-gray-400 line-through text-sm">
              ${product.price}
            </span>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          {product.dynamicFields.length > 0 && (
            <div className="flex items-center gap-2">
              <FiCheck size={16} className="text-green-500" />
              <span>{product.dynamicFields.length} custom field{product.dynamicFields.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {product.predefinedFields.filter(f => f.isActive).length > 0 && (
            <div className="flex items-center gap-2">
              <FiCheck size={16} className="text-green-500" />
              <span>{product.predefinedFields.filter(f => f.isActive).length} predefined field{product.predefinedFields.filter(f => f.isActive).length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {product.offers.length > 0 && (
            <div className="flex items-center gap-2">
              <FiGift size={16} className="text-green-500" />
              <span>{product.offers.length} active offer{product.offers.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            <FiEdit size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;