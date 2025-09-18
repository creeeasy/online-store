import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
const ClientNavbar: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const getNavLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    const baseStyle: React.CSSProperties = {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.lg,
      fontWeight: theme.fonts.medium,
      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
      transition: 'all 0.3s ease',
      textDecoration: 'none',
    };
    const activeStyle: React.CSSProperties = {
      backgroundColor: theme.colors.backgroundSecondary,
      color: theme.colors.primary,
      boxShadow: theme.shadows.sm,
    };
    const hoverStyle: React.CSSProperties = {
      backgroundColor: theme.colors.backgroundSecondary,
      color: theme.colors.primary,
    };
    return {
      ...baseStyle,
      ...(isActive ? activeStyle : {}),
      ':hover': hoverStyle,
    };
  };
  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 0.5s ease',
    backgroundColor: isScrolled
      ? `${theme.colors.surface}F2`
      : theme.colors.surface,
    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
    boxShadow: isScrolled ? theme.shadows.lg : theme.shadows.md,
    borderBottom: isScrolled
      ? `1px solid ${theme.colors.primaryLight}40`
      : 'none',
  };
  const logoWrapperStyle: React.CSSProperties = {
    position: 'relative',
  };
  const logoIconStyle: React.CSSProperties = {
    width: '2.5rem',
    height: '2.5rem',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    borderRadius: theme.borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.md,
    transition: 'all 0.3s ease',
  };
  const logoTextStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: theme.fonts.bold,
    background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: 'all 0.3s ease',
  };
  const taglineStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    marginTop: '-4px',
    transition: 'color 0.3s ease',
  };
  const menuButtonStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    color: theme.colors.textSecondary,
    borderRadius: theme.borderRadius.lg,
    transition: 'all 0.3s ease',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  };
  return (
    <>
      <nav style={navStyle}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${theme.spacing.md} ${theme.spacing.md}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo Section */}
            <Link
              to="/"
              style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, textDecoration: 'none' }}
            >
              <div
                style={logoIconStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={logoTextStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(90deg, ${theme.colors.primaryDark}, ${theme.colors.primary})`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`;
                  }}
                >
                  Cheerful Shop
                </span>
                <span
                  style={taglineStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }}
                >
                  Discover • Shop • Love
                </span>
              </div>
            </Link>
            {/* Desktop Navigation */}
            <div style={{ display: 'none', gap: theme.spacing.sm, '@media (min-width: 768px)': { display: 'flex' } }}>
              <Link to="/" style={getNavLinkStyle('/')}>Home</Link>
              <Link to="/products" style={getNavLinkStyle('/products')}>Products</Link>
              <Link to="/contact" style={getNavLinkStyle('/contact')}>Contact</Link>
              <Link to="/admin" style={getNavLinkStyle('/admin')}>Admin</Link>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                ...menuButtonStyle,
                '@media (min-width: 768px)': { display: 'none' }
              }}
            >
              <svg
                style={{ width: '24px', height: '24px', transition: 'transform 0.3s ease', transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu Content */}
        <div style={{
          maxHeight: isMobileMenuOpen ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          backgroundColor: theme.colors.surface,
          borderTop: isMobileMenuOpen ? `1px solid ${theme.colors.border}` : 'none',
          padding: isMobileMenuOpen ? theme.spacing.md : '0',
          '@media (min-width: 768px)': { display: 'none' }
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            <Link to="/" style={getNavLinkStyle('/')} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" style={getNavLinkStyle('/products')} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            <Link to="/contact" style={getNavLinkStyle('/contact')} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link to="/admin" style={getNavLinkStyle('/admin')} onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
          </div>
        </div>
      </nav>
      <div style={{ height: '80px' }} />
    </>
  );
};
export default ClientNavbar;