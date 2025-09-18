// pages/AdminLogin.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAppDispatch } from '../hooks/redux';
import { clearError } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
const AdminLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (loginMutation.error) {
      loginMutation.reset();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }
    loginMutation.mutate(formData);
  };
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  };
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    maxWidth: '448px',
    width: '100%',
  };
  const headerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    padding: theme.spacing.xl,
    color: theme.colors.secondary,
    textAlign: 'center',
  };
  const iconWrapperStyle: React.CSSProperties = {
    width: '4rem',
    height: '4rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${theme.spacing.sm}`,
  };
  const formSectionStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
  };
  const errorStyle: React.CSSProperties = {
    backgroundColor: '#fff5f5',
    border: '1px solid #fecaca',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
  };
  const inputIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.textMuted,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px 12px 40px',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    transition: 'all 0.3s ease',
  };
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.secondary,
    padding: '12px',
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.fonts.semiBold,
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  };
  const linkStyle: React.CSSProperties = {
    color: theme.colors.primary,
    fontWeight: theme.fonts.semiBold,
    transition: 'color 0.3s ease',
  };
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconWrapperStyle}>
            <FiLock size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: theme.fonts.bold, marginBottom: theme.spacing.sm }}>Admin Login</h1>
          <p style={{ color: theme.colors.secondaryLight }}>Sign in to access the admin panel</p>
        </div>
        <div style={formSectionStyle}>
          {loginMutation.error && (
            <div style={errorStyle}>
              <FiAlertCircle style={{ color: theme.colors.primary }} />
              <div>
                <p style={{ color: theme.colors.text, fontWeight: theme.fonts.medium }}>Login Failed</p>
                <p style={{ color: theme.colors.textSecondary, fontSize: '0.875rem' }}>{loginMutation.error.message}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: theme.fonts.semiBold, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                Email Address
              </label>
              <div style={inputWrapperStyle}>
                <FiMail style={inputIconStyle} size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loginMutation.isPending}
                  placeholder="Enter your email"
                  style={{
                    ...inputStyle,
                    '::placeholder': { color: theme.colors.textMuted },
                    ':focus': {
                      borderColor: theme.colors.primary
                    },
                    ':disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: theme.fonts.semiBold, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                Password
              </label>
              <div style={inputWrapperStyle}>
                <FiLock style={inputIconStyle} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loginMutation.isPending}
                  placeholder="Enter your password"
                  style={{
                    ...inputStyle,
                    paddingRight: '48px',
                    '::placeholder': { color: theme.colors.textMuted },
                    ':focus': {
                      borderColor: theme.colors.primary
                    },
                    ':disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.textMuted,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    ':hover': {
                      color: theme.colors.textSecondary,
                    },
                    ':disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending || !formData.email || !formData.password}
              style={{
                ...buttonStyle,
                ':hover': {
                  background: `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.primary})`,
                },
                ':disabled': {
                  backgroundColor: theme.colors.border,
                  cursor: 'not-allowed',
                  color: theme.colors.textMuted,
                  backgroundImage: 'none',
                  boxShadow: 'none',
                }
              }}
            >
              {loginMutation.isPending ? (
                <>
                  <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '20px', width: '20px', borderBottom: `2px solid ${theme.colors.secondary}` }}></div>
                  Signing In...
                </>
              ) : (
                <>
                  <FiLock size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
            <p style={{ color: theme.colors.textSecondary }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  ...linkStyle,
                  ':hover': {
                    color: theme.colors.primaryDark
                  }
                }}
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;