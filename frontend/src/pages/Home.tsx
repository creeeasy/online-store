import React from 'react';
import ClientProductCard from '../components/ClientProductCard';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import type { IProduct } from '../types/product';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { data, isLoading, error } = useProducts();
  const navigate = useNavigate();
  const products = data?.data ?? [];

  // Hero Section Styles
  const heroSectionStyle: React.CSSProperties = {
    background: theme.colors.gradientPrimary,
    color: theme.colors.textOnPrimary,
    padding: `${theme.spacing['3xl']} 0`,
    position: 'relative',
    overflow: 'hidden',
  };

  const heroContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: theme.zIndex.base,
  };

  const heroHeadingStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['5xl'],
    fontWeight: theme.fonts.weight.black,
    marginBottom: theme.spacing.lg,
    letterSpacing: theme.fonts.letterSpacing.tighter,
    textAlign: 'center',
    lineHeight: theme.fonts.lineHeight.tight,
    textShadow: `0 2px 4px ${theme.colors.shadow}`,
  };

  const heroSubheadingStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    color: theme.colors.textOnPrimary,
    opacity: 0.9,
    marginBottom: theme.spacing.xl,
    maxWidth: '48rem',
    margin: '0 auto',
    lineHeight: theme.fonts.lineHeight.relaxed,
    textAlign: 'center',
    fontWeight: theme.fonts.weight.light,
  };

  const heroDividerStyle: React.CSSProperties = {
    width: '8rem',
    height: '4px',
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: theme.borderRadius.full,
    margin: `${theme.spacing.xl} auto`,
    opacity: 0.8,
  };

  // Main Content Styles
  const mainContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
  };

  const contentWrapperStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.md}`,
  };

  // Section Header Styles
  const sectionHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
    padding: `0 ${theme.spacing.md}`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['4xl'],
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.fonts.family.heading,
  };

  const sectionSubtitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    maxWidth: '42rem',
    margin: '0 auto',
    lineHeight: theme.fonts.lineHeight.relaxed,
  };

  const sectionDividerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  };

  const dividerLineStyle: React.CSSProperties = {
    width: '4rem',
    height: '3px',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  };

  const dividerDotStyle: React.CSSProperties = {
    width: '0.75rem',
    height: '0.75rem',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    margin: `0 ${theme.spacing.md}`,
  };

  // Product Grid Styles
  const productGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: theme.spacing.xl,
    padding: `0 ${theme.spacing.md}`,
  };

  const productCardWrapperStyle: React.CSSProperties = {
    transition: theme.transitions.normal,
    transform: 'translateY(0)',
  };

  const productCardHoverStyle: React.CSSProperties = {
    transform: 'translateY(-8px)',
  };

  // Loading State Styles
  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: theme.spacing.xl,
  };

  const spinnerStyle: React.CSSProperties = {
    width: '4rem',
    height: '4rem',
    border: `4px solid ${theme.colors.primaryLight}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: theme.borderRadius.full,
    animation: 'spin 1s linear infinite',
    marginBottom: theme.spacing.lg,
  };

  const loadingTextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  };

  // Error State Styles
  const errorStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: theme.spacing.xl,
    textAlign: 'center',
  };

  const errorIconWrapperStyle: React.CSSProperties = {
    width: '6rem',
    height: '6rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.semiBold,
    marginBottom: theme.spacing.sm,
  };

  const errorSubtextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
  };

  // Empty State Styles
  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: `${theme.spacing['3xl']} 0`,
    maxWidth: '36rem',
    margin: '0 auto',
  };

  const emptyIconWrapperStyle: React.CSSProperties = {
    width: '8rem',
    height: '8rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing.xl,
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['2xl'],
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.family.heading,
  };

  const emptyMessageStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.lg,
    lineHeight: theme.fonts.lineHeight.relaxed,
    marginBottom: theme.spacing.xl,
  };

  // CSS Animation for spinner
  const styles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  if (isLoading) {
    return (
      <div style={mainContainerStyle}>
        <style>{styles}</style>
        <div style={contentWrapperStyle}>
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <p style={loadingTextStyle}>Loading amazing products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={mainContainerStyle}>
        <div style={contentWrapperStyle}>
          <div style={errorStyle}>
            <div style={errorIconWrapperStyle}>
              <svg 
                style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  color: theme.colors.primary 
                }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <p style={errorTextStyle}>
              Oops! Something went wrong
            </p>
            <p style={errorSubtextStyle}>
              {(error as Error)?.message || 'Please try refreshing the page'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={mainContainerStyle}>
      <style>{styles}</style>
      
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={contentWrapperStyle}>
          <div style={heroContentStyle}>
            <h1 style={heroHeadingStyle}>
              Discover • Shop • Love
            </h1>
            <p style={heroSubheadingStyle}>
              Explore our curated collection of premium products, handpicked just for you. 
              Find quality items that bring joy to your everyday life.
            </p>
            <div style={heroDividerStyle}></div>
          </div>
        </div>
      </section>

     { 
      <section style={{ padding: `${theme.spacing['3xl']} 0` }}>
        <div style={contentWrapperStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              Featured Products
            </h2>
            <div style={sectionDividerStyle}>
              <div style={dividerLineStyle}></div>
              <div style={dividerDotStyle}></div>
              <div style={dividerLineStyle}></div>
            </div>
            <p style={sectionSubtitleStyle}>
              Discover quality products that bring joy to your everyday life. 
              Each item is carefully selected for excellence and value.
            </p>
          </div>

          {products.length > 0 ? (
            <div style={productGridStyle}>
              {products.map((product: IProduct) => (
                <div
                  key={product._id}
                  style={productCardWrapperStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, productCardHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, productCardWrapperStyle);
                  }}
                >
                  <ClientProductCard
                    product={product}
                    onViewDetails={() => navigate(`/${product.reference}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyIconWrapperStyle}>
                <svg 
                  style={{ 
                    width: '4rem', 
                    height: '4rem', 
                    color: theme.colors.primary 
                  }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                  />
                </svg>
              </div>
              <h3 style={emptyTitleStyle}>No Products Available</h3>
              <p style={emptyMessageStyle}>
                Our amazing products are coming soon! We're curating the best collection 
                just for you. Check back later for exciting new arrivals.
              </p>
            </div>
          )}
        </div>
      </section> }
    </div>
  );
};

export default Home;