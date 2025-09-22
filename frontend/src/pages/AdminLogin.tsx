import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAppDispatch } from '../hooks/redux';
import { clearError } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiShield } from 'react-icons/fi';

const AdminLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  // Enhanced styles using the theme system
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.backgroundSecondary,
    fontFamily: theme.fonts.family.body,
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundPatternStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.colors.primary} 0%, transparent 50%), 
                      radial-gradient(circle at 80% 20%, ${theme.colors.secondary} 0%, transparent 50%), 
                      radial-gradient(circle at 40% 80%, ${theme.colors.primaryLight} 0%, transparent 50%)`,
    backgroundSize: '600px 600px',
    animation: 'float 20s ease-in-out infinite',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.xl,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    maxWidth: '480px',
    width: '100%',
    position: 'relative',
    zIndex: 1,
    animation: 'slideInUp 0.6s ease-out',
  };

  const headerStyle: React.CSSProperties = {
    background: theme.colors.gradientPrimary,
    padding: `${theme.spacing['2xl']} ${theme.spacing.xl}`,
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerPatternStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
  };

  const iconWrapperStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${theme.spacing.lg}`,
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['3xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    marginBottom: theme.spacing.sm,
    position: 'relative',
    zIndex: 1,
    letterSpacing: theme.fonts.letterSpacing.tight,
    lineHeight: theme.fonts.lineHeight.tight,
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.regular,
    position: 'relative',
    zIndex: 1,
    lineHeight: theme.fonts.lineHeight.relaxed,
  };

  const formSectionStyle: React.CSSProperties = {
    padding: `${theme.spacing['2xl']} ${theme.spacing.xl}`,
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: `rgba(229, 115, 115, 0.08)`,
    border: `1px solid ${theme.colors.error}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    animation: 'shake 0.5s ease-in-out',
  };

  const fieldGroupStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.fonts.family.body,
    letterSpacing: theme.fonts.letterSpacing.wide,
    textTransform: 'uppercase' as const,
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    transition: theme.transitions.normal,
  };

  const inputIconStyle = (fieldName: string): React.CSSProperties => ({
    position: 'absolute',
    left: theme.spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    color: focusedField === fieldName ? theme.colors.primary : theme.colors.textMuted,
    transition: theme.transitions.fast,
    zIndex: 1,
  });

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 48px`,
    border: `2px solid ${focusedField === fieldName ? theme.colors.primary : theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: focusedField === fieldName ? theme.colors.surface : theme.colors.backgroundSecondary,
    color: theme.colors.text,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.body,
    transition: theme.transitions.normal,
    boxShadow: focusedField === fieldName ? `0 0 0 3px ${theme.colors.primary}20` : 'none',
    outline: 'none',
  });

  const passwordToggleStyle: React.CSSProperties = {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.textMuted,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.fast,
    zIndex: 1,
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    background: theme.colors.gradientPrimary,
    color: theme.colors.textOnPrimary,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.semiBold,
    fontFamily: theme.fonts.family.body,
    transition: theme.transitions.normal,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    letterSpacing: theme.fonts.letterSpacing.wide,
    textTransform: 'uppercase' as const,
    boxShadow: theme.shadows.lg,
    position: 'relative',
    overflow: 'hidden',
  };

  const buttonDisabledStyle: React.CSSProperties = {
    ...buttonStyle,
    background: theme.colors.disabled,
    cursor: 'not-allowed',
    color: theme.colors.textMuted,
    boxShadow: 'none',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    padding: `${theme.spacing.lg} 0`,
    borderTop: `1px solid ${theme.colors.border}`,
  };

  const linkStyle: React.CSSProperties = {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.semiBold,
    textDecoration: 'none',
    transition: theme.transitions.fast,
    borderRadius: theme.borderRadius.sm,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    margin: `0 -${theme.spacing.sm}`,
  };

  const isFormValid = formData.email && formData.password;
  const isSubmitting = loginMutation.isPending;

  return (
    <div style={containerStyle}>
      <div style={backgroundPatternStyle} />
      
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={headerPatternStyle} />
          <div style={iconWrapperStyle}>
            <FiShield size={36} />
          </div>
          <h1 style={titleStyle}>Admin Login</h1>
          <p style={subtitleStyle}>Sign in to access the admin panel</p>
        </div>

        <div style={formSectionStyle}>
          {loginMutation.error && (
            <div style={errorStyle}>
              <FiAlertCircle 
                style={{ 
                  color: theme.colors.error, 
                  flexShrink: 0, 
                  marginTop: '2px' 
                }} 
                size={20} 
              />
              <div>
                <p style={{ 
                  color: theme.colors.error, 
                  fontWeight: theme.fonts.weight.semiBold,
                  fontSize: theme.fonts.size.md,
                  marginBottom: theme.spacing.xs
                }}>
                  Login Failed
                </p>
                <p style={{ 
                  color: theme.colors.textSecondary, 
                  fontSize: theme.fonts.size.sm,
                  lineHeight: theme.fonts.lineHeight.relaxed
                }}>
                  {loginMutation.error.message}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <div style={inputWrapperStyle}>
                <FiMail style={inputIconStyle('email')} size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your email address"
                  style={inputStyle('email')}
                />
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Password</label>
              <div style={inputWrapperStyle}>
                <FiLock style={inputIconStyle('password')} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                  style={{
                    ...inputStyle('password'),
                    paddingRight: '56px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  style={passwordToggleStyle}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.color = theme.colors.primary;
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.color = theme.colors.textMuted;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={!isFormValid || isSubmitting ? buttonDisabledStyle : buttonStyle}
              onMouseEnter={(e) => {
                if (isFormValid && !isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.shadows.xl;
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid && !isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{ 
                    animation: 'spin 1s linear infinite', 
                    borderRadius: '50%', 
                    height: '20px', 
                    width: '20px', 
                    border: `2px solid ${theme.colors.textOnPrimary}`,
                    borderTopColor: 'transparent'
                  }} />
                  Signing In...
                </>
              ) : (
                <>
                  <FiShield size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div style={footerStyle}>
            <p style={{ 
              color: theme.colors.textSecondary, 
              fontSize: theme.fonts.size.md,
              marginBottom: theme.spacing.sm
            }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primaryDark;
                  e.currentTarget.style.backgroundColor = theme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced animations via CSS-in-JS */}
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-10px) rotate(1deg);
            }
            66% {
              transform: translateY(5px) rotate(-1deg);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          input::placeholder {
            color: ${theme.colors.textMuted};
            opacity: 0.8;
          }

          input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;