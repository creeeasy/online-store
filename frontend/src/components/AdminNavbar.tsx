import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { validateToken, resetAuth } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { FiUser, FiLogOut, FiMenu, FiX, FiHome, FiPackage, FiMail, FiShield, FiChevronDown } from 'react-icons/fi';
import { authAPI } from '../utils/authAPI';
import { clearAuthToken, type ApiError } from '../utils/apiClient';
import { LuSheet } from 'react-icons/lu';
import { RiPixelfedFill } from 'react-icons/ri';
import { FaBots, FaRobot } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';

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
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOrdersDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        try {
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

  const isOrdersActive = isActivePath('/admin/inquiries') || isActivePath('/admin/fakeOrder');

  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 0.3s ease',
    backgroundColor: isScrolled ? `${theme.colors.surface}E6` : theme.colors.surface,
    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
    boxShadow: isScrolled ? `0 8px 32px ${theme.colors.shadow}` : `0 4px 12px ${theme.colors.shadow}`,
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  const logoStyle: React.CSSProperties = {
    background: theme.colors.gradientPrimary || `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    borderRadius: '12px',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 12px ${theme.colors.primary}30`,
    transition: 'all 0.3s ease',
  };

  const getNavLinkStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'relative',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    backgroundColor: isActive ? `${theme.colors.primary}10` : 'transparent',
    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
    border: isActive ? `1px solid ${theme.colors.primary}30` : '1px solid transparent',
  });

  const userProfileStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const userAvatarStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: theme.colors.gradientSecondary || `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.secondaryDark})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: '0.9rem',
    boxShadow: `0 2px 8px ${theme.colors.secondary}30`,
  };

  const logoutButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: theme.colors.gradientPrimary || `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.textOnPrimary,
    border: 'none',
    cursor: 'pointer',
    boxShadow: `0 4px 12px ${theme.colors.primary}40`,
  };

  const mobileMenuStyle: React.CSSProperties = {
    background: `linear-gradient(to bottom, ${theme.colors.surface}, ${theme.colors.backgroundSecondary})`,
    borderTop: `1px solid ${theme.colors.border}`,
    padding: '1.5rem 1rem',
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
    borderRadius: '20px',
    boxShadow: `0 20px 60px ${theme.colors.shadow}`,
    border: `1px solid ${theme.colors.border}`,
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    left: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: '12px',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
    border: `1px solid ${theme.colors.border}`,
    minWidth: '200px',
    padding: '0.5rem',
    zIndex: 100,
  };

  const dropdownItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  return (
    <>
      <nav style={navbarStyle}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo & Brand Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                <div style={{ position: 'relative' }}>
                  <div 
                    style={logoStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 6px 20px ${theme.colors.primary}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}30`;
                    }}
                  >
                    <FiShield size={20} color={theme.colors.textOnPrimary} />
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.success,
                    border: `2px solid ${theme.colors.surface}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.white,
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    background: theme.colors.gradientPrimary || `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                  }}>
                    Admin Panel
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: theme.colors.textMuted,
                    marginTop: '2px',
                    fontWeight: '400',
                  }}>
                    Management Dashboard
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div style={{ display: 'flex', gap: '0.5rem' }} className="hidden md:flex px-1.5">
                <Link
                  to="/admin"
                  style={getNavLinkStyle(isActivePath('/admin'))}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin')) {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
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
                  <FiHome size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  style={getNavLinkStyle(isActivePath('/admin/products'))}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin/products')) {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
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
                  <FiPackage size={16} />
                  Products
                </Link>
                
                {/* Orders Dropdown */}
                <div 
                  ref={dropdownRef}
                  style={{ position: 'relative' }}
                >
                  <button
                    onClick={() => setIsOrdersDropdownOpen(!isOrdersDropdownOpen)}
                    style={{
                      ...getNavLinkStyle(isOrdersActive),
                      cursor: 'pointer',
                      background: 'none',
                      border: isOrdersActive ? `1px solid ${theme.colors.primary}30` : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isOrdersActive) {
                        e.currentTarget.style.backgroundColor = theme.colors.hover;
                        e.currentTarget.style.color = theme.colors.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isOrdersActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = theme.colors.textSecondary;
                      }
                    }}
                  >
                    <FiShoppingCart size={16} />
                    Orders
                    <FiChevronDown 
                      size={14} 
                      style={{
                        transition: 'transform 0.3s ease',
                        transform: isOrdersDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.error,
                      animation: 'pulse 2s infinite',
                    }} />
                  </button>

                  {isOrdersDropdownOpen && (
                    <div style={dropdownStyle}>
                      <Link
                        to="/admin/inquiries"
                        style={dropdownItemStyle}
                        onClick={() => setIsOrdersDropdownOpen(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.hover;
                          e.currentTarget.style.color = theme.colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = theme.colors.textSecondary;
                        }}
                      >
                        <FiMail size={16} />
                        <span>Inquiries</span>
                      </Link>
                      <Link
                        to="/admin/fakeOrders"
                        style={dropdownItemStyle}
                        onClick={() => setIsOrdersDropdownOpen(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.hover;
                          e.currentTarget.style.color = theme.colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = theme.colors.textSecondary;
                        }}
                      >
                        <FiShoppingCart size={16} />
                        <span>Fake Orders</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/admin/GoogleSheet"
                  style={{
                    ...getNavLinkStyle(isActivePath('/admin/GoogleSheet')),
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin/GoogleSheet')) {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                      e.currentTarget.style.color = theme.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/admin/GoogleSheet')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textSecondary;
                    }
                  }}
                >
                  <LuSheet  size={16} />
                  GoogleSheet
                </Link>
                <Link
                  to="/admin/pixel"
                  style={{
                    ...getNavLinkStyle(isActivePath('/admin/pixel')),
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin/pixel')) {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                      e.currentTarget.style.color = theme.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/admin/pixel')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textSecondary;
                    }
                  }}
                >
                  <RiPixelfedFill size={16} />
                  pixel
                </Link>
                <Link
                  to="/admin/Bot"
                  style={{
                    ...getNavLinkStyle(isActivePath('/admin/Bot')),
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/admin/Bot')) {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                      e.currentTarget.style.color = theme.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/admin/Bot')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textSecondary;
                    }
                  }}
                >
                  <FaRobot  size={16} />
                  Bot
                </Link>
              </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* User Profile */}
              <div 
                style={userProfileStyle} 
                className="hidden md:flex"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.hover;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                <div style={userAvatarStyle}>
                  {userInitial}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: theme.colors.text,
                    lineHeight: 1,
                  }}>
                    {username}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: theme.colors.textMuted,
                    marginTop: '2px',
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
                  e.currentTarget.style.boxShadow = `0 6px 20px ${theme.colors.primary}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
                }}
              >
                <FiLogOut size={16} />
                <span className="hidden md:inline">
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  padding: '0.75rem',
                  color: theme.colors.textSecondary,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="md:hidden"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div style={{
          overflow: 'hidden',
          transition: 'all 0.5s ease',
          maxHeight: isMobileMenuOpen ? '600px' : '0',
          opacity: isMobileMenuOpen ? 1 : 0,
        }} className="md:hidden">
          <div style={mobileMenuStyle}>
            {/* User Info in Mobile Menu */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: theme.colors.surface,
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`,
              marginBottom: '1.5rem',
            }}>
              <div style={{
                ...userAvatarStyle,
                width: '48px',
                height: '48px',
                fontSize: '1.1rem',
              }}>
                {userInitial}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: theme.colors.text,
                }}>
                  {username}
                </span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: theme.colors.textMuted,
                }}>
                  Administrator
                </span>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            {[
              { path: '/admin', label: 'Dashboard', icon: FiHome },
              { path: '/admin/products', label: 'Products', icon: FiPackage },
              { path: '/admin/inquiries', label: 'Inquiries', icon: FiMail, hasNotification: true },
              { path: '/admin/fakeOrder', label: 'Fake Orders', icon: FiShoppingCart },
              { path: '/admin/GoogleSheet', label: 'GoogleSheet', icon: LuSheet },
              { path: '/admin/pixel', label: 'Pixel', icon: RiPixelfedFill },
              { path: '/admin/Bot', label: 'Bot', icon: FaRobot },
            ].map(({ path, label, icon: Icon, hasNotification }) => (
              <Link
                key={path}
                to={path}
                style={{
                  ...getNavLinkStyle(isActivePath(path)),
                  marginBottom: '0.5rem',
                  padding: '1rem 1.25rem',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
                onMouseEnter={(e) => {
                  if (!isActivePath(path)) {
                    e.currentTarget.style.backgroundColor = theme.colors.hover;
                    e.currentTarget.style.color = theme.colors.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActivePath(path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }
                }}
              >
                <Icon size={20} />
                {label}
                {hasNotification && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.error,
                    marginLeft: 'auto',
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
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: `${theme.colors.error}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <FiLogOut size={32} color={theme.colors.error} />
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: theme.colors.text,
              margin: '0 0 1rem 0',
            }}>
              Confirm Logout
            </h3>
            <p style={{
              fontSize: '1rem',
              color: theme.colors.textSecondary,
              margin: '0 0 2rem 0',
              lineHeight: 1.5,
            }}>
              Are you sure you want to log out of the admin panel? You will need to sign in again to access the dashboard.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.hover;
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
                  padding: '0.875rem 1.5rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  background: theme.colors.gradientPrimary || `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                  color: theme.colors.textOnPrimary,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 4px 12px ${theme.colors.primary}40`,
                }}
                disabled={logoutMutation.isPending}
                onMouseEnter={(e) => {
                  if (!logoutMutation.isPending) {
                    e.currentTarget.style.boxShadow = `0 6px 20px ${theme.colors.primary}50`;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!logoutMutation.isPending) {
                    e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content overlap */}
      <div style={{ height: '88px' }} />
    </>
  );
};

export default AdminNavbar;