import React, { useState } from 'react';
import type { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-red-500 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Red accent corner */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Heart icon on hover */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={product.images[0]} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isHovered ? 'opacity-10' : 'opacity-0'
        }`}></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="mb-4">
          {product.discountPrice ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500 line-through text-lg">${product.price.toFixed(2)}</span>
              <div className="relative">
                <span className="text-2xl font-bold text-red-500">${product.discountPrice.toFixed(2)}</span>
                {/* Sale badge */}
                <div className="absolute -top-2 -right-8 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  SALE
                </div>
              </div>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button 
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform ${
            isHovered 
              ? 'bg-red-500 text-white shadow-lg scale-105' 
              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {isHovered ? '👀 View Details' : 'View Product'}
        </button>
      </div>

      {/* Discount Badge */}
      {product.discountPrice && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform -rotate-12">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </div>
        </div>
      )}

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-500 ${
        isHovered ? 'w-full' : 'w-0'
      }`}></div>
    </div>
  );
};

export default ProductCard;