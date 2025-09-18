import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { validateToken, resetAuth } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { authAPI } from '../utils/authAPI';
import { clearAuthToken, type ApiError } from '../utils/apiClient';
const AdminNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [username, setUsername] = useState('Admin');
  const [userInitial, setUserInitial] = useState('A');
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authAPI.logout();
      } catch (error) {
        console.warn('Server logout failed, clearing client state anyway');
      }
      clearAuthToken();
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      return { success: true };
    },
    onSuccess: () => {
      dispatch(resetAuth());
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    },
    onError: (error: ApiError) => {
      dispatch(resetAuth());
      queryClient.clear();
      toast.error(error.message || 'Logout failed');
      navigate('/admin/login');
    },
  });
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        try {
          // Use validateToken thunk to fetch user data
          await dispatch(validateToken()).unwrap();
        } catch (error) {
          console.error('Failed to validate token:', error);
        }
      }
    };
    fetchUserData();
  }, [dispatch, user]);
  useEffect(() => {
    if (user) {
      setUsername(user.username || 'Admin');
      setUserInitial(user.username?.charAt(0).toUpperCase() || 'A');
    } else {
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUsername(userData.username || 'Admin');
          setUserInitial(userData.username?.charAt(0).toUpperCase() || 'A');
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
        }
      }
    }
  }, [user]);
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    logoutMutation.mutate();
    setShowLogoutConfirm(false);
  };
  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };
  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: isScrolled
      ? `${theme.colors.surface}F2`
      : theme.colors.surface,
    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
    boxShadow: isScrolled
      ? `0 4px 20px ${theme.colors.shadow}`
      : theme.shadows.lg,
    borderBottom: isScrolled
      ? `1px solid ${theme.colors.primaryLight}40`
      : 'none',
    transition: 'all 0.5s ease',
  };
  const logoStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    borderRadius: theme.borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.md,
    transition: 'all 0.3s ease',
    position: 'relative',
  };
  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '16px',
    height: '16px',
    backgroundColor: theme.colors.accent,
    borderRadius: '50%',
    border: `2px solid ${theme.colors.surface}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const getNavLinkStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'relative',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.lg,
    fontWeight: theme.fonts.medium,
    backgroundColor: isActive ? theme.colors.backgroundSecondary : 'transparent',
    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    boxShadow: isActive ? theme.shadows.sm : 'none',
  });
  const profileStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };
  const avatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.secondary,
    fontWeight: theme.fonts.bold,
    fontSize: '0.875rem',
    transition: 'transform 0.3s ease',
  };
  const logoutButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    fontWeight: theme.fonts.semiBold,
    transition: 'all 0.3s ease',
    boxShadow: theme.shadows.md,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
  };
  const modalStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.xl,
    maxWidth: '400px',
    margin: theme.spacing.md,
  };
  return (
    <>
      <nav style={navbarStyle}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${theme.spacing.md}`,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.md,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo & Brand Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xl }}>
              <Link
                to="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  textDecoration: 'none',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={logoStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = theme.shadows.lg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = theme.shadows.md;
                    }}
                  >
                    <FiUser style={{ width: '20px', height: '20px', color: theme.colors.secondary }} />
                  </div>
                  <div style={badgeStyle}>
                    <svg
                      style={{ width: '8px', height: '8px', color: '#f59e0b' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: theme.fonts.bold,
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Admin Panel
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: theme.colors.textMuted,
                    marginTop: '-2px',
                  }}>
                    Management Dashboard
                  </span>
                </div>
              </Link>
              {/* Desktop Navigation Links */}
              <div style={{
                display: 'flex',
                gap: theme.spacing.xs,
                '@media (max-width: 768px)': { display: 'none' }
              }}>
                <Link
                  to="/admin"
                  style={getNavLinkStyle(isActivePath('/admin'))}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin')) {
                      e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                      e.currentTarget.style.color = theme.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/admin')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textSecondary;
                    }
                  }}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  style={getNavLinkStyle(isActivePath('/admin/products'))}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin/products')) {
                      e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                      e.currentTarget.style.color = theme.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/admin/products')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textSecondary;
                    }
                  }}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Products
                </Link>
                <Link
                  to="/admin/inquiries"
                  style={getNavLinkStyle(isActivePath('/admin/inquiries'))}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin/inquiries')) {
                      e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                      e.currentTarget.style.color = theme.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/admin/inquiries')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textSecondary;
                    }
                  }}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  Inquiries
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: theme.colors.primary,
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  }} />
                </Link>
              </div>
            </div>
            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              {/* User Profile */}
              <div
                style={{
                  ...profileStyle,
                  '@media (max-width: 768px)': { display: 'none' }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryLight + '20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                }}
              >
                <div
                  style={avatarStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {userInitial}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: theme.fonts.semiBold,
                    color: theme.colors.text,
                  }}>
                    {username}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: theme.colors.textMuted,
                  }}>
                    Administrator
                  </span>
                </div>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={logoutButtonStyle}
                disabled={logoutMutation.isPending}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
              >
                <FiLogOut style={{ width: '16px', height: '16px' }} />
                <span style={{ '@media (max-width: 768px)': { display: 'none' } }}>
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </span>
              </button>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  padding: theme.spacing.sm,
                  color: theme.colors.textSecondary,
                  borderRadius: theme.borderRadius.lg,
                  transition: 'all 0.3s ease',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  '@media (min-width: 768px)': { display: 'none' }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                {isMobileMenuOpen ? (
                  <FiX style={{ width: '24px', height: '24px' }} />
                ) : (
                  <FiMenu style={{ width: '24px', height: '24px' }} />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div style={{
          maxHeight: isMobileMenuOpen ? '320px' : '0',
          opacity: isMobileMenuOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.5s ease',
          '@media (min-width: 768px)': { display: 'none' }
        }}>
          <div style={{
            background: `linear-gradient(to bottom, ${theme.colors.surface}, ${theme.colors.backgroundSecondary})`,
            borderTop: `1px solid ${theme.colors.border}`,
            padding: `${theme.spacing.lg} ${theme.spacing.md}`,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}>
            {/* User Info in Mobile Menu */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.secondary,
                fontWeight: theme.fonts.bold,
              }}>
                {userInitial}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: theme.fonts.semiBold,
                  color: theme.colors.text,
                }}>
                  {username}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: theme.colors.textMuted,
                }}>
                  Administrator
                </span>
              </div>
            </div>
            {/* Mobile Navigation Links */}
            {[
              { path: '/admin', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { path: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
              { path: '/admin/inquiries', label: 'Inquiries', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' },
            ].map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                style={{
                  ...getNavLinkStyle(isActivePath(path)),
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  textDecoration: 'none',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                {label}
                {path === '/admin/inquiries' && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: theme.colors.primary,
                    borderRadius: '50%',
                  }} />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: `0 auto ${theme.spacing.md}`,
              }}>
                <FiLogOut style={{
                  width: '32px',
                  height: '32px',
                  color: theme.colors.primary
                }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: theme.fonts.bold,
                color: theme.colors.text,
                margin: `0 0 ${theme.spacing.md}`,
              }}>
                Confirm Logout
              </h3>
              <p style={{
                color: theme.colors.textSecondary,
                margin: `0 0 ${theme.spacing.xl}`,
                lineHeight: '1.5',
              }}>
                Are you sure you want to log out of the admin panel?
              </p>
              <div style={{ display: 'flex', gap: theme.spacing.md }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{
                    flex: 1,
                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    fontWeight: theme.fonts.semiBold,
                    borderRadius: theme.borderRadius.lg,
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.border;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  style={{
                    flex: 1,
                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                    color: theme.colors.secondary,
                    fontWeight: theme.fonts.semiBold,
                    borderRadius: theme.borderRadius.lg,
                    transition: 'all 0.3s ease',
                    boxShadow: theme.shadows.md,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  disabled={logoutMutation.isPending}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Spacer to prevent content overlap */}
      <div style={{ height: '80px' }} />
    </>
  );
};
export default AdminNavbar;