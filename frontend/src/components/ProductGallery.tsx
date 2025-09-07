import React, { useState, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Preload images
    images.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]));
        if (index === 0) setIsLoading(false);
      };
      img.src = src;
    });
  }, [images]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') setIsZoomed(false);
  };

  if (!images.length) {
    return (
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={images[currentIndex]}
          alt={`Product view ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isZoomed ? 'scale-150' : 'scale-100 group-hover:scale-105'
          } ${loadedImages.has(currentIndex) ? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
        />

        {/* Overlay for zoom hint */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm text-gray-700 font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Click to zoom
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setIsZoomed(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-red-500 scale-125 shadow-lg'
                    : 'bg-white/60 hover:bg-white/80 hover:scale-110'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsZoomed(false);
              }}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-red-500 ring-4 ring-red-100 shadow-lg'
                  : 'border-gray-200 hover:border-red-300 hover:shadow-md'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  loadedImages.has(index) ? 'opacity-100' : 'opacity-50'
                } ${index === currentIndex ? 'scale-100' : 'hover:scale-110'}`}
                draggable={false}
              />
            </button>
          ))}
          
          {/* Show more indicator */}
          {images.length > 4 && (
            <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-600">+{images.length - 4}</span>
                <p className="text-xs text-gray-500 mt-1">more</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zoom Instructions */}
      {isZoomed && (
        <div className="text-center">
          <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Click again to zoom out • Use arrow keys to navigate
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;