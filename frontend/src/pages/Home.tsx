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
  const heroSectionStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.secondary,
    padding: `${theme.spacing.xl} 0`,
  };
  const heroHeadingStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: theme.fonts.bold,
    marginBottom: theme.spacing.md,
    letterSpacing: '-1px',
    textAlign: 'center',
  };
  const heroSubheadingStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: theme.colors.secondaryLight,
    marginBottom: theme.spacing.lg,
    maxWidth: '48rem',
    margin: '0 auto',
    lineHeight: '1.6',
    textAlign: 'center',
  };
  const sectionHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '2.25rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  };
  const productGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
  };
  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: `${theme.spacing.xl} 0`,
  };
  const emptyIconWrapperStyle: React.CSSProperties = {
    width: '6rem',
    height: '6rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing.lg,
  };
  const emptyTitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  };
  const emptyMessageStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    maxWidth: '28rem',
    margin: '0 auto',
  };
  const errorStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  };
  const errorIconWrapperStyle: React.CSSProperties = {
    width: '4rem',
    height: '4rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  };
  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  };
  const spinnerStyle: React.CSSProperties = {
    width: '4rem',
    height: '4rem',
    border: `4px solid ${theme.colors.primary}`,
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: theme.spacing.md,
  };
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: theme.spacing.lg }}>
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <p style={{ fontSize: '1.125rem', color: theme.colors.textSecondary }}>Loading amazing products...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: theme.spacing.lg }}>
          <div style={errorStyle}>
            <div style={errorIconWrapperStyle}>
              <svg style={{ width: '2rem', height: '2rem', color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p style={{ fontSize: '1.125rem', color: theme.colors.primary, fontWeight: theme.fonts.medium }}>
              Oops! {(error as Error)?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
      <div style={heroSectionStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `${theme.spacing.lg} ${theme.spacing.md}` }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={heroHeadingStyle}>
              Discover • Shop • Love
            </h1>
            <p style={heroSubheadingStyle}>
              Explore our curated collection of premium products, handpicked just for you
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '6rem', height: '4px', backgroundColor: theme.colors.secondary, borderRadius: '9999px' }}></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `${theme.spacing.xl} ${theme.spacing.md}` }}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>
            Our Featured Products
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md }}>
            <div style={{ width: '4rem', height: '4px', backgroundColor: theme.colors.primary, borderRadius: '9999px' }}></div>
            <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: theme.colors.primary, borderRadius: '9999px', margin: `0 ${theme.spacing.sm}` }}></div>
            <div style={{ width: '4rem', height: '4px', backgroundColor: theme.colors.primary, borderRadius: '9999px' }}></div>
          </div>
          <p style={{ fontSize: '1.125rem', color: theme.colors.textSecondary, maxWidth: '42rem', margin: '0 auto' }}>
            Discover quality products that bring joy to your everyday life
          </p>
        </div>
        <div style={productGridStyle}>
          {products.map((product: IProduct) => (
            <div
              key={product._id}
              style={{
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ClientProductCard
                product={product}
                onViewDetails={() => navigate(`/products/${product._id}`)}
              />
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div style={emptyStateStyle}>
            <div style={emptyIconWrapperStyle}>
              <svg style={{ width: '3rem', height: '3rem', color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 style={emptyTitleStyle}>No Products Yet</h3>
            <p style={emptyMessageStyle}>
              Our amazing products are coming soon! Check back later for exciting new arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;