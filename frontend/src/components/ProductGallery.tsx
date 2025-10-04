import React, { useState, useEffect, useRef } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef<number>(0);
  const lastTouchX = useRef<number>(0);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 30;
  const velocityThreshold = 0.3;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (currentIndex < images.length - 1) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 350);
    }
    setIsZoomed(false);
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 350);
    }
    setIsZoomed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') setIsZoomed(false);
  };

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    const touchX = e.targetTouches[0].clientX;
    setTouchStart(touchX);
    setIsDragging(true);
    lastTouchTime.current = Date.now();
    lastTouchX.current = touchX;
    setDragVelocity(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    const currentTime = Date.now();
    
    // Calculate velocity
    const timeDelta = currentTime - lastTouchTime.current;
    const positionDelta = currentTouch - lastTouchX.current;
    const velocity = positionDelta / (timeDelta || 1);
    
    setTouchEnd(currentTouch);
    const offset = currentTouch - touchStart;
    
    // Add resistance at edges
    let adjustedOffset = offset;
    if ((currentIndex === 0 && offset > 0) || 
        (currentIndex === images.length - 1 && offset < 0)) {
      adjustedOffset = offset * 0.3; // Resistance effect
    }
    
    setDragOffset(adjustedOffset);
    setDragVelocity(velocity);
    
    lastTouchTime.current = currentTime;
    lastTouchX.current = currentTouch;
  };

  const onTouchEnd = () => {
    if (!touchStart || touchEnd === 0) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const absDistance = Math.abs(distance);
    const absVelocity = Math.abs(dragVelocity);
    
    // Determine if swipe should trigger based on distance OR velocity
    const shouldTrigger = absDistance > minSwipeDistance || absVelocity > velocityThreshold;
    
    if (shouldTrigger) {
      if (distance > 0 && currentIndex < images.length - 1) {
        nextImage();
      } else if (distance < 0 && currentIndex > 0) {
        prevImage();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
    setDragVelocity(0);
  };

  // Mouse event handlers for desktop drag (optional)
  const onMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    setTouchEnd(0);
    const mouseX = e.clientX;
    setTouchStart(mouseX);
    setIsDragging(true);
    lastTouchTime.current = Date.now();
    lastTouchX.current = mouseX;
    setDragVelocity(0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isMobile) return;
    const currentMouse = e.clientX;
    const currentTime = Date.now();
    
    // Calculate velocity
    const timeDelta = currentTime - lastTouchTime.current;
    const positionDelta = currentMouse - lastTouchX.current;
    const velocity = positionDelta / (timeDelta || 1);
    
    setTouchEnd(currentMouse);
    const offset = currentMouse - touchStart;
    
    // Add resistance at edges
    let adjustedOffset = offset;
    if ((currentIndex === 0 && offset > 0) || 
        (currentIndex === images.length - 1 && offset < 0)) {
      adjustedOffset = offset * 0.3;
    }
    
    setDragOffset(adjustedOffset);
    setDragVelocity(velocity);
    
    lastTouchTime.current = currentTime;
    lastTouchX.current = currentMouse;
  };

  const onMouseUp = () => {
    if (isMobile) return;
    if (!touchStart || touchEnd === 0) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const absDistance = Math.abs(distance);
    const absVelocity = Math.abs(dragVelocity);
    
    const shouldTrigger = absDistance > minSwipeDistance || absVelocity > velocityThreshold;
    
    if (shouldTrigger) {
      if (distance > 0 && currentIndex < images.length - 1) {
        nextImage();
      } else if (distance < 0 && currentIndex > 0) {
        prevImage();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
    setDragVelocity(0);
  };

  const onMouseLeave = () => {
    if (isDragging && !isMobile) {
      setIsDragging(false);
      setDragOffset(0);
      setTouchStart(0);
      setTouchEnd(0);
    }
  };

  // Calculate which images to show (current, previous, next)
  const getVisibleImages = () => {
    const visible = [];
    
    // Previous image
    if (currentIndex > 0) {
      visible.push({
        index: currentIndex - 1,
        position: -1,
        image: images[currentIndex - 1]
      });
    }
    
    // Current image
    visible.push({
      index: currentIndex,
      position: 0,
      image: images[currentIndex]
    });
    
    // Next image
    if (currentIndex < images.length - 1) {
      visible.push({
        index: currentIndex + 1,
        position: 1,
        image: images[currentIndex + 1]
      });
    }
    
    return visible;
  };

  // Theme-based styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    width: '100%'
  };

  const mobileContainerStyle: React.CSSProperties = {
    ...containerStyle,
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)',
    marginRight: 'calc(-50vw + 50%)'
  };

  const emptyStateContainerStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '1',
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary}, ${theme.colors.border})`,
    borderRadius: isMobile ? 0 : theme.borderRadius.lg,
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
    borderRadius: isMobile ? 0 : theme.borderRadius.lg,
    overflow: 'hidden',
    boxShadow: isMobile ? 'none' : theme.shadows.lg,
    cursor: isZoomed ? 'zoom-out' : (isMobile ? 'grab' : 'zoom-in'),
    touchAction: 'pan-y pinch-zoom',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none'
  };

  const mobileMainImageContainerStyle: React.CSSProperties = {
    ...mainImageContainerStyle,
    width: '100vw',
    maxWidth: '100vw',
    borderRadius: 0,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  const imagesWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const imageSlideStyle = (position: number): React.CSSProperties => {
    const containerWidth = imageContainerRef.current?.offsetWidth || window.innerWidth;
    const baseTranslate = position * containerWidth;
    const currentTranslate = baseTranslate + (isDragging ? dragOffset : 0);
    
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transition: (isDragging || isTransitioning) ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: `translateX(${currentTranslate}px)`,
      willChange: 'transform'
    };
  };

  const loadingSpinnerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  };

  const spinnerStyle: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    border: `4px solid ${theme.colors.border}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const slideImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    userSelect: 'none',
    pointerEvents: 'none',
    display: 'block'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1
  };

  const zoomHintStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    display: isMobile ? 'none' : 'block',
    zIndex: 2
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
    opacity: isMobile ? 0.7 : 0,
    pointerEvents: 'auto',
    zIndex: 3
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
    fontWeight: theme.fonts.medium,
    pointerEvents: 'none',
    zIndex: 2
  };

  const dotsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.md,
    pointerEvents: 'none',
    zIndex: 2
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
    cursor: 'pointer',
    pointerEvents: 'auto'
  });

  const thumbnailGridStyle: React.CSSProperties = {
    display: isMobile ? 'none' : 'grid',
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
    textAlign: 'center',
    display: isMobile ? 'none' : 'block'
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

  const swipeHintStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    display: isMobile ? 'block' : 'none'
  };

  const swipeHintTextStyle: React.CSSProperties = {
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
      <div style={isMobile ? mobileContainerStyle : containerStyle}>
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
      </div>
    );
  }

  const visibleImages = getVisibleImages();

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .gallery-group:hover .gallery-overlay {
            opacity: ${isMobile ? 0 : 1};
          }
          .gallery-group:hover .gallery-zoom-hint {
            opacity: ${isMobile ? 0 : 1};
          }
          .gallery-group:hover .gallery-nav-button {
            opacity: 1;
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
      <div style={isMobile ? mobileContainerStyle : containerStyle}>
        {/* Main Image - Full width on mobile with swipe support */}
        <div 
          ref={imageContainerRef}
          className="gallery-group"
          style={isMobile ? mobileMainImageContainerStyle : mainImageContainerStyle}
          onClick={() => !isMobile && !isDragging && setIsZoomed(!isZoomed)}
          onKeyDown={handleKeyDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          tabIndex={0}
        >
          {isLoading && currentIndex === 0 && (
            <div style={loadingSpinnerStyle}>
              <div style={spinnerStyle}></div>
            </div>
          )}
          
          {/* Images wrapper with sliding effect */}
          <div style={imagesWrapperStyle}>
            {visibleImages.map((item) => (
              <div
                key={item.index}
                style={imageSlideStyle(item.position)}
              >
                <img
                  src={item.image}
                  alt={`Product view ${item.index + 1}`}
                  style={{
                    ...slideImageStyle,
                    opacity: loadedImages.has(item.index) ? 1 : 0
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Overlay for zoom hint - Hidden on mobile */}
          <div className="gallery-overlay" style={overlayStyle}></div>
          <div className="gallery-zoom-hint" style={zoomHintStyle}>
            <div style={zoomHintContentStyle}>
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Click to zoom
            </div>
          </div>

          {/* Navigation Arrows - Semi-transparent on mobile */}
          {images.length > 1 && (
            <>
              <button
                className="gallery-nav-button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                style={{ 
                  ...navigationButtonStyle, 
                  left: isMobile ? '1rem' : theme.spacing.lg 
                }}
                aria-label="Previous image"
                disabled={currentIndex === 0}
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
                style={{ 
                  ...navigationButtonStyle, 
                  right: isMobile ? '1rem' : theme.spacing.lg 
                }}
                aria-label="Next image"
                disabled={currentIndex === images.length - 1}
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
          {images.length > 1 && isMobile && (
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

        {/* Swipe hint for mobile */}
        {isMobile && images.length > 1 && (
          <div style={swipeHintStyle}>
            <p style={swipeHintTextStyle}>
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Swipe left or right to browse images
            </p>
          </div>
        )}

        {/* Thumbnail Strip - Hidden on mobile */}
        {images.length > 1 && !isMobile && (
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

        {/* Zoom Instructions - Hidden on mobile */}
        {isZoomed && !isMobile && (
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