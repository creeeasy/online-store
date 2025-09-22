import React from 'react';
import { FiPackage, FiInbox, FiTrendingUp, FiActivity, FiArrowUpRight } from 'react-icons/fi';
import { useOrderInquiries, useOrderInquiryStats } from '../hooks/useOrderInquiry';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProducts, useProductStats } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';

const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();

  const { data: productsData, isLoading: productsLoading } = useProducts({ page: 1, limit: 5 });
  const { data: inquiriesData, isLoading: inquiriesLoading } = useOrderInquiries({ page: 1, limit: 10 });
  const { data: inquiryStats, isLoading: inquiryStatsLoading } = useOrderInquiryStats();
  const { data: productStats, isLoading: productStatsLoading } = useProductStats();

  const loading = productsLoading || inquiriesLoading || inquiryStatsLoading || productStatsLoading;

  const totalProducts =
    productStats?.data?.totalProducts || productsData?.pagination?.totalItems || 0;
  const totalInquiries =
    inquiryStats?.totalInquiries || inquiriesData?.pagination?.totalItems || 0;
  const recentInquiries = inquiryStats?.recentInquiries || 0;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: <FiPackage size={28} />,
      link: "/admin/products",
      changeType: "positive",
      color: theme.colors.primary,
      bgColor: `${theme.colors.primary}10`,
    },
    {
      title: "Total Inquiries", 
      value: totalInquiries.toString(),
      icon: <FiInbox size={28} />,
      link: "/admin/inquiries",
      change: `${recentInquiries} recent`,
      changeType: "neutral",
      color: theme.colors.secondary,
      bgColor: `${theme.colors.secondary}10`,
    },
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, and organize your product catalog",
      icon: <FiPackage size={22} />,
      href: "/admin/products",
      color: theme.colors.primary,
    },
    {
      title: "View Inquiries",
      description: "Review and respond to customer inquiries",
      icon: <FiInbox size={22} />,
      href: "/admin/inquiries",
      color: theme.colors.secondary,
    },
  ];

  // Enhanced styles using the theme system
  const pageContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    fontFamily: theme.fonts.family.body,
  };

  const contentContainerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing['2xl']} ${theme.spacing.xl}`,
  };

  const headerSectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing['2xl'],
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['4xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing.md,
    letterSpacing: theme.fonts.letterSpacing.tight,
    lineHeight: theme.fonts.lineHeight.tight,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.regular,
    lineHeight: theme.fonts.lineHeight.relaxed,
  };

  const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['3xl'],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['3xl'],
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.xl,
    transition: theme.transitions.normal,
    position: 'relative',
    overflow: 'hidden',
  };

  const statCardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  };

  const statContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const statTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: theme.fonts.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['4xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    color: theme.colors.text,
    lineHeight: theme.fonts.lineHeight.tight,
    marginBottom: theme.spacing.sm,
  };

  const statIconWrapperStyle = (color: string, bgColor: string): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    backgroundColor: bgColor,
    borderRadius: theme.borderRadius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    boxShadow: theme.shadows.md,
    border: `1px solid ${color}20`,
  });

  const statChangeStyle = (changeType: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    color: changeType === 'positive' ? theme.colors.success : theme.colors.textSecondary,
  });

  const sectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing['2xl'],
    position: 'relative',
    overflow: 'hidden',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['2xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const actionsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.lg,
  };

  const actionCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.lg,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.xl,
    textDecoration: 'none',
    transition: theme.transitions.normal,
    backgroundColor: theme.colors.backgroundSecondary,
    position: 'relative',
    overflow: 'hidden',
  };

  const actionIconWrapperStyle = (color: string): React.CSSProperties => ({
    width: '56px',
    height: '56px',
    backgroundColor: `${color}15`,
    borderRadius: theme.borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
    color: color,
    border: `1px solid ${color}30`,
    transition: theme.transitions.normal,
  });

  const actionContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const actionTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.fonts.family.heading,
  };

  const actionDescriptionStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.lineHeight.relaxed,
  };

  const actionArrowStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    transition: theme.transitions.fast,
    marginLeft: theme.spacing.md,
  };

  return (
    <div style={pageContainerStyle}>
      <div style={contentContainerStyle}>
        {/* Enhanced Header */}
        <div style={headerSectionStyle}>
          <h1 style={titleStyle}>Admin Dashboard</h1>
          <p style={subtitleStyle}>
            Monitor your business metrics and manage your operations
          </p>
        </div>

        {loading ? (
          <div style={loadingContainerStyle}>
            <LoadingSpinner size="lg" />
            <p style={{ 
              marginTop: theme.spacing.lg, 
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.size.lg
            }}>
              Loading dashboard data...
            </p>
          </div>
        ) : (
          <>
            {/* Enhanced Stats Grid */}
            <div style={statsGridStyle}>
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  style={statCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.shadows.xl;
                    e.currentTarget.style.borderColor = stat.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                >
                  {/* Subtle background pattern */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `radial-gradient(circle, ${stat.color}08 0%, transparent 70%)`,
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)',
                  }} />
                  
                  <div style={statCardHeaderStyle}>
                    <div style={statContentStyle}>
                      <p style={statTitleStyle}>{stat.title}</p>
                      <p style={statValueStyle}>{stat.value}</p>
                      {stat.change && (
                        <div style={statChangeStyle(stat.changeType)}>
                          {stat.changeType === 'positive' && <FiTrendingUp size={16} />}
                          <span>{stat.change}</span>
                        </div>
                      )}
                    </div>
                    <div style={statIconWrapperStyle(stat.color, stat.bgColor)}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Quick Actions */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>
                  <FiActivity size={28} />
                  Quick Actions
                </h2>
              </div>
              
              <div style={actionsGridStyle}>
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    style={actionCardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = theme.shadows.lg;
                      e.currentTarget.style.borderColor = action.color;
                      e.currentTarget.style.backgroundColor = theme.colors.surface;
                      
                      // Update arrow color on hover
                      const arrow = e.currentTarget.querySelector('.action-arrow') as HTMLElement;
                      if (arrow) {
                        arrow.style.color = action.color;
                        arrow.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = theme.colors.border;
                      e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                      
                      // Reset arrow on mouse leave
                      const arrow = e.currentTarget.querySelector('.action-arrow') as HTMLElement;
                      if (arrow) {
                        arrow.style.color = theme.colors.textMuted;
                        arrow.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <div style={actionIconWrapperStyle(action.color)}>
                      {action.icon}
                    </div>
                    <div style={actionContentStyle}>
                      <h3 style={actionTitleStyle}>{action.title}</h3>
                      <p style={actionDescriptionStyle}>{action.description}</p>
                    </div>
                    <FiArrowUpRight 
                      className="action-arrow"
                      style={actionArrowStyle} 
                      size={20} 
                    />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced animations via CSS-in-JS */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .action-arrow {
            transition: all ${theme.transitions.fast};
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;