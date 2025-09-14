// components/AdminNavbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getCurrentUser } from '../store/slices/authSlice';
import { FiUser, FiLogOut, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { logoutAdmin } from '../hooks/useAuth';

const AdminNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useAppSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [username, setUsername] = useState('Admin');
  const [userInitial, setUserInitial] = useState('A');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, [dispatch, user]);

  // Update username and initial when user data changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || 'Admin');
      setUserInitial(user.username?.charAt(0).toUpperCase() || 'A');
    } else {
      // Fallback to localStorage if available
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
    dispatch(logoutAdmin());
    setShowLogoutConfirm(false);
    navigate('/admin/login');
  };

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-red-100' 
          : 'bg-white shadow-lg'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo & Brand Section */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/admin" 
                className="group flex items-center space-x-3"
              >
                <div className="relative">
                  {/* Admin Logo */}
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  {/* Admin badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-2 h-2 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-10 h-10 bg-red-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
                </div>
                
                {/* Brand Text */}
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-red-900 transition-all duration-300">
                    Admin Panel
                  </span>
                  <span className="text-xs text-gray-500 -mt-1 group-hover:text-red-500 transition-colors duration-300">
                    Management Dashboard
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex space-x-1">
                <Link 
                  to="/admin" 
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath('/admin')
                      ? 'bg-red-100 text-red-700 shadow-md'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                </Link>
                
                <Link 
                  to="/admin/products" 
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath('/admin/products')
                      ? 'bg-red-100 text-red-700 shadow-md'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Products</span>
                  </div>
                </Link>
                
                <Link 
                  to="/admin/inquiries" 
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath('/admin/inquiries')
                      ? 'bg-red-100 text-red-700 shadow-md'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>Inquiries</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* User Profile with actual username */}
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 hover:bg-red-50 rounded-xl transition-all duration-300 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                  {userInitial}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600">
                    {username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role === 'admin' ? 'Administrator' : user?.role || 'User'}
                  </span>
                </div>
              </div>

              {/* Settings Button */}
              <Link
                to="/admin/settings"
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
              >
                <FiSettings className="w-5 h-5" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
              >
                <FiLogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden md:block">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
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
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-gradient-to-b from-white to-red-50 border-t border-red-100 px-4 py-6 space-y-4">
            {/* User Info in Mobile Menu */}
            <div className="flex items-center space-x-3 px-4 py-3 bg-white rounded-xl border border-red-100">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                {userInitial}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{username}</span>
                <span className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Administrator' : user?.role || 'User'}
                </span>
              </div>
            </div>

            <Link 
              to="/admin" 
              className={`block py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isActivePath('/admin')
                  ? 'bg-red-100 text-red-700 shadow-md'
                  : 'text-gray-700 hover:text-red-500 hover:bg-red-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </div>
            </Link>
            
            <Link 
              to="/admin/products" 
              className={`block py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isActivePath('/admin/products')
                  ? 'bg-red-100 text-red-700 shadow-md'
                  : 'text-gray-700 hover:text-red-500 hover:bg-red-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Products</span>
              </div>
            </Link>
            
            <Link 
              to="/admin/inquiries" 
              className={`block py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isActivePath('/admin/inquiries')
                  ? 'bg-red-100 text-red-700 shadow-md'
                  : 'text-gray-700 hover:text-red-500 hover:bg-red-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>Inquiries</span>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </Link>

            <Link 
              to="/admin/settings" 
              className="block py-3 px-4 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <FiSettings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
              <p className="text-gray-600 mb-8">Are you sure you want to log out of the admin panel?</p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
};

export default AdminNavbar;