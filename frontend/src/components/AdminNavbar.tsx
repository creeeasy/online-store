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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? `bg-[${theme.colors.surface}]/95 backdrop-blur-md shadow-lg border-b border-[${theme.colors.primaryLight}]/25`
            : `bg-[${theme.colors.surface}] shadow-[${theme.shadows.lg}]`
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-3">
          <div className="flex justify-between items-center">
            {/* Logo & Brand Section */}
            <div className="flex items-center space-x-4 md:space-x-8">
              <Link to="/admin" className="flex items-center space-x-2 no-underline">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})` }}
                  >
                    <FiUser className="w-5 h-5" style={{ color: theme.colors.secondary }} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: theme.colors.accent, borderColor: theme.colors.surface }}>
                    <svg className="w-2 h-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Admin Panel
                  </span>
                  <span className="text-xs -mt-1" style={{ color: theme.colors.textMuted }}>
                    Management Dashboard
                  </span>
                </div>
              </Link>
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex space-x-1">
                <Link
                  to="/admin"
                  className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out flex items-center gap-2 no-underline ${
                    isActivePath('/admin')
                      ? `bg-[${theme.colors.backgroundSecondary}] text-[${theme.colors.primary}] shadow-[${theme.shadows.sm}]`
                      : `bg-transparent text-[${theme.colors.textSecondary}] hover:bg-[${theme.colors.backgroundSecondary}] hover:text-[${theme.colors.primary}]`
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out flex items-center gap-2 no-underline ${
                    isActivePath('/admin/products')
                      ? `bg-[${theme.colors.backgroundSecondary}] text-[${theme.colors.primary}] shadow-[${theme.shadows.sm}]`
                      : `bg-transparent text-[${theme.colors.textSecondary}] hover:bg-[${theme.colors.backgroundSecondary}] hover:text-[${theme.colors.primary}]`
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Products
                </Link>
                <Link
                  to="/admin/inquiries"
                  className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out flex items-center gap-2 no-underline ${
                    isActivePath('/admin/inquiries')
                      ? `bg-[${theme.colors.backgroundSecondary}] text-[${theme.colors.primary}] shadow-[${theme.shadows.sm}]`
                      : `bg-transparent text-[${theme.colors.textSecondary}] hover:bg-[${theme.colors.backgroundSecondary}] hover:text-[${theme.colors.primary}]`
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  Inquiries
                  <div className="w-2 h-2 rounded-full bg-[theme.colors.primary] animate-pulse" />
                </Link>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* User Profile */}
              <div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-[${theme.colors.backgroundSecondary}] rounded-lg transition-colors duration-300 ease-in-out cursor-pointer hover:bg-[${theme.colors.primaryLight}]/20"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-transform duration-300 ease-in-out transform hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                    color: theme.colors.secondary
                  }}
                >
                  {userInitial}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                    {username}
                  </span>
                  <span className="text-xs" style={{ color: theme.colors.textMuted }}>
                    Administrator
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                  color: theme.colors.secondary,
                  boxShadow: theme.shadows.md,
                }}
                disabled={logoutMutation.isPending}
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden md:inline">
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[${theme.colors.textSecondary}] rounded-lg transition-all duration-300 ease-in-out md:hidden hover:bg-[${theme.colors.backgroundSecondary}] hover:text-[${theme.colors.primary}]"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div
            className="border-t py-4 px-4 flex flex-col space-y-4"
            style={{
              background: `linear-gradient(to bottom, ${theme.colors.surface}, ${theme.colors.backgroundSecondary})`,
              borderColor: theme.colors.border,
            }}
          >
            {/* User Info in Mobile Menu */}
            <div
              className="flex items-center space-x-2 p-2 bg-[${theme.colors.surface}] rounded-lg border"
              style={{ borderColor: theme.colors.border }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                  color: theme.colors.secondary,
                }}
              >
                {userInitial}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                  {username}
                </span>
                <span className="text-xs" style={{ color: theme.colors.textMuted }}>
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
                className={`relative px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out flex items-center gap-2 no-underline ${
                  isActivePath(path)
                    ? `bg-[${theme.colors.backgroundSecondary}] text-[${theme.colors.primary}] shadow-[${theme.shadows.sm}]`
                    : `bg-transparent text-[${theme.colors.textSecondary}] hover:bg-[${theme.colors.backgroundSecondary}] hover:text-[${theme.colors.primary}]`
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                {label}
                {path === '/admin/inquiries' && (
                  <div className="w-2 h-2 rounded-full bg-[${theme.colors.primary}]" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-3xl shadow-2xl border p-6 max-w-sm mx-4"
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: theme.colors.backgroundSecondary }}
              >
                <FiLogOut className="w-8 h-8" style={{ color: theme.colors.primary }} />
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: theme.colors.text }}
              >
                Confirm Logout
              </h3>
              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: theme.colors.textSecondary }}
              >
                Are you sure you want to log out of the admin panel?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ease-in-out hover:bg-[${theme.colors.border}]"
                  style={{ backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 font-semibold rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                    color: theme.colors.secondary,
                  }}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
    </>
  );
};

export default AdminNavbar;