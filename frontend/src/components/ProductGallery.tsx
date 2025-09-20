import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const { theme } = useTheme();
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

  // Theme-based styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  };

  const emptyStateContainerStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '1',
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary}, ${theme.colors.border})`,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const emptyStateIconContainerStyle: React.CSSProperties = {
    width: '4rem',
    height: '4rem',
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${theme.spacing.lg}`
  };

  const emptyStateTextStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.medium,
    fontSize: '0.875rem'
  };

  const mainImageContainerStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '1',
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary}, ${theme.colors.border})`,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    boxShadow: theme.shadows.lg,
    cursor: isZoomed ? 'zoom-out' : 'zoom-in'
  };

  const loadingSpinnerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const spinnerStyle: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    border: `4px solid ${theme.colors.border}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const mainImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.7s ease',
    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
    userSelect: 'none',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  };

  const zoomHintStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  };

  const zoomHintContentStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '9999px',
    fontSize: '0.875rem',
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const navigationButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3rem',
    height: '3rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: theme.colors.text,
    borderRadius: '50%',
    border: 'none',
    boxShadow: theme.shadows.md,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0
  };

  const counterStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: theme.colors.secondary,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium
  };

  const dotsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.md
  };

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    transform: isActive ? 'scale(1.25)' : 'scale(1)',
    boxShadow: isActive ? theme.shadows.md : 'none',
    cursor: 'pointer'
  });

  const thumbnailGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing.md
  };

  const thumbnailButtonStyle = (isActive: boolean): React.CSSProperties => ({
    aspectRatio: '1',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    background: 'none',
    padding: 0,
    boxShadow: isActive ? `0 0 0 4px ${theme.colors.primary}20` : 'none'
  });

  const thumbnailImageStyle = (isActive: boolean, isLoaded: boolean): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.3s ease',
    opacity: isLoaded ? 1 : 0.5,
    transform: isActive ? 'scale(1)' : 'scale(1)',
    userSelect: 'none',
  });

  const moreIndicatorStyle: React.CSSProperties = {
    aspectRatio: '1',
    borderRadius: theme.borderRadius.lg,
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary}, ${theme.colors.border})`,
    border: `2px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };

  const moreCountStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.textSecondary
  };

  const moreTextStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs
  };

  const zoomInstructionsStyle: React.CSSProperties = {
    textAlign: 'center'
  };

  const instructionsTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.backgroundSecondary,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: '9999px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  if (!images.length) {
    return (
      <div style={emptyStateContainerStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={emptyStateIconContainerStyle}>
            <svg 
              style={{ width: '2rem', height: '2rem', color: theme.colors.primary }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p style={emptyStateTextStyle}>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .gallery-group:hover .gallery-overlay {
            opacity: 1;
          }
          .gallery-group:hover .gallery-zoom-hint {
            opacity: 1;
          }
          .gallery-group:hover .gallery-nav-button {
            opacity: 1;
          }
          .gallery-group:hover .gallery-main-image {
            transform: scale(1.05);
          }
          .gallery-thumbnail:hover .gallery-thumbnail-image {
            transform: scale(1.1);
          }
          .gallery-nav-button:hover {
            background-color: rgba(255, 255, 255, 1) !important;
            color: ${theme.colors.primary} !important;
          }
          .gallery-dot:hover {
            background-color: rgba(255, 255, 255, 0.8) !important;
            transform: scale(1.1) !important;
          }
          .gallery-thumbnail:hover {
            border-color: ${theme.colors.primary} !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }
        `}
      </style>
      <div style={containerStyle}>
        {/* Main Image */}
        <div 
          className="gallery-group"
          style={mainImageContainerStyle}
          onClick={() => setIsZoomed(!isZoomed)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {isLoading && (
            <div style={loadingSpinnerStyle}>
              <div style={spinnerStyle}></div>
            </div>
          )}
          
          <img
            src={images[currentIndex]}
            alt={`Product view ${currentIndex + 1}`}
            className="gallery-main-image"
            style={{
              ...mainImageStyle,
              opacity: loadedImages.has(currentIndex) ? 1 : 0
            }}
          />

          {/* Overlay for zoom hint */}
          <div className="gallery-overlay" style={overlayStyle}></div>
          <div className="gallery-zoom-hint" style={zoomHintStyle}>
            <div style={zoomHintContentStyle}>
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Click to zoom
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="gallery-nav-button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                style={{ ...navigationButtonStyle, left: theme.spacing.lg }}
                aria-label="Previous image"
              >
                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="gallery-nav-button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                style={{ ...navigationButtonStyle, right: theme.spacing.lg }}
                aria-label="Next image"
              >
                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div style={counterStyle}>
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div style={dotsContainerStyle}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className="gallery-dot"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    setIsZoomed(false);
                  }}
                  style={dotStyle(index === currentIndex)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div style={thumbnailGridStyle}>
            {images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                className="gallery-thumbnail"
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                }}
                style={thumbnailButtonStyle(index === currentIndex)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="gallery-thumbnail-image"
                  style={thumbnailImageStyle(index === currentIndex, loadedImages.has(index))}
                />
              </button>
            ))}
            
            {/* Show more indicator */}
            {images.length > 4 && (
              <div style={moreIndicatorStyle}>
                <div>
                  <span style={moreCountStyle}>+{images.length - 4}</span>
                  <p style={moreTextStyle}>more</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Zoom Instructions */}
        {isZoomed && (
          <div style={zoomInstructionsStyle}>
            <p style={instructionsTextStyle}>
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Click again to zoom out • Use arrow keys to navigate
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductGallery;