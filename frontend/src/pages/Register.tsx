// pages/Register.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { useAppDispatch } from '../hooks/redux';
import { clearError } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle, FiUserPlus } from 'react-icons/fi';
const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const registerMutation = useRegister();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  const validateForm = () => {
    const errors: string[] = [];
    if (formData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    if (!formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
    }
    if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (registerMutation.error) {
      registerMutation.reset();
    }
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    registerMutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: 'admin'
    });
  };
  const displayErrors = [...validationErrors];
  if (registerMutation.error && !registerMutation.error.validationErrors) {
    displayErrors.push(registerMutation.error.message);
  }
  if (registerMutation.error?.validationErrors) {
    displayErrors.push(...registerMutation.error.validationErrors.map(err => err.message || err.toString()));
  }
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
            <FiUserPlus size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: theme.fonts.bold, marginBottom: theme.spacing.sm }}>Create Account</h1>
          <p style={{ color: theme.colors.secondaryLight }}>Sign up for admin access</p>
        </div>
        <div style={formSectionStyle}>
          {displayErrors.length > 0 && (
            <div style={errorStyle}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm }}>
                <FiAlertCircle style={{ color: theme.colors.primary, flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: theme.colors.text, fontWeight: theme.fonts.medium }}>
                    {registerMutation.error ? 'Registration Failed' : 'Validation Error'}
                  </p>
                  <ul style={{ color: theme.colors.textSecondary, fontSize: '0.875rem', marginTop: theme.spacing.xs, listStyleType: 'none', paddingLeft: 0 }}>
                    {displayErrors.map((err, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>• {err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: theme.fonts.semiBold, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                Username
              </label>
              <div style={inputWrapperStyle}>
                <FiUser style={inputIconStyle} size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={registerMutation.isPending}
                  placeholder="Enter your username"
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
                  disabled={registerMutation.isPending}
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
                  disabled={registerMutation.isPending}
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
                  disabled={registerMutation.isPending}
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
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: theme.fonts.semiBold, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                Confirm Password
              </label>
              <div style={inputWrapperStyle}>
                <FiLock style={inputIconStyle} size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={registerMutation.isPending}
                  placeholder="Confirm your password"
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={registerMutation.isPending}
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
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={
                registerMutation.isPending ||
                !formData.username ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword
              }
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
              {registerMutation.isPending ? (
                <>
                  <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '20px', width: '20px', borderBottom: `2px solid ${theme.colors.secondary}` }}></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
            <p style={{ color: theme.colors.textSecondary }}>
              Already have an account?{' '}
              <Link
                to="/admin/login"
                style={{
                  ...linkStyle,
                  ':hover': {
                    color: theme.colors.primaryDark
                  }
                }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;