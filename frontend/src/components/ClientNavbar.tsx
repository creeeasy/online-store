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

  const getNavLinkStyle = (path: string): React.CSSProperties => {
    const isActive = location.pathname === path;
    return {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.lg,
      fontWeight: isActive ? theme.fonts.weight.semiBold : theme.fonts.weight.medium,
      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
      backgroundColor: isActive ? `${theme.colors.primary}15` : 'transparent',
      transition: theme.transitions.fast,
      textDecoration: 'none',
      fontSize: theme.fonts.size.sm,
      fontFamily: theme.fonts.family.body,
      letterSpacing: theme.fonts.letterSpacing.wide,
      position: 'relative' as const,
      display: 'inline-flex',
      alignItems: 'center',
      border: `1px solid ${isActive ? `${theme.colors.primary}30` : 'transparent'}`,
      boxShadow: isActive ? theme.shadows.xs : 'none',
    };
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.sticky,
    transition: theme.transitions.normal,
    background: isScrolled
      ? `linear-gradient(135deg, ${theme.colors.backgroundSecondary}E6 0%, ${theme.colors.surface}E6 100%)`
      : `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.surface} 100%)`,
    backdropFilter: isScrolled ? 'blur(16px) saturate(1.8)' : 'blur(8px)',
    WebkitBackdropFilter: isScrolled ? 'blur(16px) saturate(1.8)' : 'blur(8px)',
    boxShadow: isScrolled ? theme.shadows.lg : theme.shadows.sm,
    borderBottom: `1px solid ${isScrolled ? `${theme.colors.primary}20` : `${theme.colors.border}30`}`,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  };

  const logoWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    textDecoration: 'none',
    transition: theme.transitions.fast,
  };

  const logoIconStyle: React.CSSProperties = {
    width: '2.5rem',
    height: '2.5rem',
    background: theme.colors.gradientPrimary,
    borderRadius: theme.borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.md,
    transition: theme.transitions.fast,
    position: 'relative',
    overflow: 'hidden',
  };

  const logoTextContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: theme.transitions.fast,
    letterSpacing: theme.fonts.letterSpacing.tight,
    lineHeight: theme.fonts.lineHeight.tight,
  };

  const taglineStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.fonts.weight.medium,
    letterSpacing: theme.fonts.letterSpacing.wider,
    textTransform: 'uppercase',
    transition: theme.transitions.fast,
    fontFamily: theme.fonts.family.body,
  };

  const desktopNavStyle: React.CSSProperties = {
    display: 'none',
    gap: theme.spacing.xs,
    alignItems: 'center',
    padding: theme.spacing.xs,
    backgroundColor: `${theme.colors.surface}80`,
    borderRadius: theme.borderRadius.xl,
    border: `1px solid ${theme.colors.border}`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const menuButtonStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    color: theme.colors.textSecondary,
    borderRadius: theme.borderRadius.lg,
    transition: theme.transitions.fast,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.xs,
  };

  const mobileMenuStyle: React.CSSProperties = {
    maxHeight: isMobileMenuOpen ? '300px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.surface} 100%)`,
    borderTop: `1px solid ${theme.colors.border}30`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  const mobileMenuContentStyle: React.CSSProperties = {
    padding: isMobileMenuOpen ? `${theme.spacing.md} ${theme.spacing.lg}` : '0',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    opacity: isMobileMenuOpen ? 1 : 0,
    transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-8px)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    transitionDelay: isMobileMenuOpen ? '0.1s' : '0s',
  };
  return (
    <>
      <nav style={navStyle}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Enhanced Logo Section */}
            <Link
              to="/"
              style={logoWrapperStyle}
              onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector('.logo-icon') as HTMLElement;
                const text = e.currentTarget.querySelector('.logo-text') as HTMLElement;
                const tagline = e.currentTarget.querySelector('.logo-tagline') as HTMLElement;
                
                if (icon) {
                  icon.style.transform = 'scale(1.05) rotate(5deg)';
                  icon.style.boxShadow = theme.shadows.lg;
                }
                if (text) {
                  text.style.background = theme.colors.gradientSecondary;
                }
                if (tagline) {
                  tagline.style.color = theme.colors.secondary;
                }
              }}
              onMouseLeave={(e) => {
                const icon = e.currentTarget.querySelector('.logo-icon') as HTMLElement;
                const text = e.currentTarget.querySelector('.logo-text') as HTMLElement;
                const tagline = e.currentTarget.querySelector('.logo-tagline') as HTMLElement;
                
                if (icon) {
                  icon.style.transform = 'scale(1) rotate(0deg)';
                  icon.style.boxShadow = theme.shadows.md;
                }
                if (text) {
                  text.style.background = theme.colors.gradientPrimary;
                }
                if (tagline) {
                  tagline.style.color = theme.colors.textMuted;
                }
              }}
            >
              <div className="logo-icon" style={logoIconStyle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                  <circle cx="9" cy="12" r="1"/>
                  <circle cx="15" cy="12" r="1"/>
                  <path d="M12 14C13.1 14 14 14.9 14 16H10C10 14.9 10.9 14 12 14Z"/>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  borderRadius: theme.borderRadius.lg,
                }}></div>
              </div>
              <div className="logo-text-container" style={logoTextContainerStyle}>
                <span className="logo-text" style={logoTextStyle}>
                  Cheerful Shop
                </span>
                <span className="logo-tagline" style={taglineStyle}>
                  Discover • Shop • Love
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="desktop-nav" style={desktopNavStyle}>
              {[
                { path: '/', label: 'Home' },
                { path: '/products', label: 'Products' },
                { path: '/contact', label: 'Contact' },
                { path: '/admin', label: 'Admin' }
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  style={getNavLinkStyle(path)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== path) {
                      e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                      e.currentTarget.style.color = theme.colors.primary;
                      e.currentTarget.style.borderColor = `${theme.colors.primary}20`;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = theme.shadows.xs;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textSecondary;
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={menuButtonStyle}
              className="mobile-menu-button"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                e.currentTarget.style.color = theme.colors.primary;
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
                e.currentTarget.style.color = theme.colors.textSecondary;
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                  transition: theme.transitions.fast,
                  transform: isMobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div style={mobileMenuStyle}>
          <div style={mobileMenuContentStyle}>
            {[
              { path: '/', label: 'Home' },
              { path: '/products', label: 'Products' },
              { path: '/contact', label: 'Contact' },
              { path: '/admin', label: 'Admin' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={getNavLinkStyle(path)}
                onClick={() => setIsMobileMenuOpen(false)}
                onMouseEnter={(e) => {
                  if (location.pathname !== path) {
                    e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.borderColor = `${theme.colors.primary}20`;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== path) {
                    e.currentTarget.style.backgroundColor = location.pathname === path ? `${theme.colors.primary}15` : 'transparent';
                    e.currentTarget.style.color = location.pathname === path ? theme.colors.primary : theme.colors.textSecondary;
                    e.currentTarget.style.borderColor = location.pathname === path ? `${theme.colors.primary}30` : 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      {/* Spacer */}
      <div style={{ height: '80px' }} />
    </>
  );
};

export default ClientNavbar;