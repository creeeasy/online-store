import React from 'react';
import InquiryList from '../components/InquiryList';
import InquiryStats from '../components/InquiryStats';
import { useTheme } from '../contexts/ThemeContext';
import { FiBarChart2, FiInbox, FiMessageSquare } from 'react-icons/fi';
import InquiryListFakeOrders from '../components/InquiryListFakeOrders';

const FakeOrders: React.FC = () => {
  const { theme } = useTheme();
  
  // Enhanced styles using the theme system
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    fontFamily: theme.fonts.family.body,
  };

  const innerContainerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: `${theme.spacing['2xl']} ${theme.spacing.xl}`,
  };

  const headerSectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing['3xl'],
    textAlign: 'center',
    position: 'relative',
  };

  const headerBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    height: '200px',
    background: `radial-gradient(circle, ${theme.colors.primary}10 0%, transparent 70%)`,
    borderRadius: '50%',
    zIndex: 0,
  };

  const titleContainerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const iconWrapperStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['4xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    letterSpacing: theme.fonts.letterSpacing.tight,
    lineHeight: theme.fonts.lineHeight.tight,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.regular,
    lineHeight: theme.fonts.lineHeight.relaxed,
    margin: 0,
    maxWidth: '600px',
  };

  const contentGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing['2xl'],
    alignItems: 'start',
  };

  const inquiryListSectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    position: 'relative',
  };

  const statsSectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    position: 'relative',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.backgroundSecondary,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.semiBold,
    fontFamily: theme.fonts.family.heading,
    color: theme.colors.text,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const sectionContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  const decorativePatternStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '120px',
    height: '120px',
    background: `radial-gradient(circle, ${theme.colors.primary}05 0%, transparent 70%)`,
    borderRadius: '50%',
    transform: 'translate(40%, -40%)',
    zIndex: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        {/* Enhanced Header */}
        <div style={headerSectionStyle}>
          <div style={headerBackgroundStyle} />
          <div style={titleContainerStyle}>
            <div style={iconWrapperStyle}>
              <FiMessageSquare 
                size={36} 
                style={{ color: theme.colors.primary }} 
              />
            </div>
            <h1 style={titleStyle}>Fake Orders</h1>
          </div>
        </div>
        
        {/* Enhanced Content Grid */}
        <div style={{
          ...contentGridStyle,
          // Responsive grid
          '@media (min-width: 1024px)': {
            gridTemplateColumns: '2fr 1fr'
          }
        } as React.CSSProperties}>
          
          {/* Enhanced Inquiry List Section */}
          <div style={inquiryListSectionStyle}>
            <div style={decorativePatternStyle} />
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>
                <FiInbox size={24} />
                Recent Inquiries
              </h2>
            </div>
            <div style={sectionContentStyle}>
              <InquiryListFakeOrders />
            </div>
          </div>
          
        </div>
      </div>

      {/* Enhanced animations and responsive styles via CSS-in-JS */}
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

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          /* Responsive grid styles */
          @media (min-width: 1024px) {
            .content-grid {
              grid-template-columns: 2fr 1fr;
            }
          }

          /* Enhanced hover effects for sections */
          .inquiry-section:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.xl};
            transition: ${theme.transitions.normal};
          }

          .stats-section:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.xl};
            transition: ${theme.transitions.normal};
          }

          /* Mobile responsive adjustments */
          @media (max-width: 768px) {
            .header-section {
              text-align: center;
              padding: ${theme.spacing.xl} ${theme.spacing.md};
            }
            
            .title {
              font-size: ${theme.fonts.size['2xl']};
            }
            
            .subtitle {
              font-size: ${theme.fonts.size.lg};
            }
            
            .content-grid {
              gap: ${theme.spacing.xl};
            }
          }
        `}
      </style>
    </div>
  );
};

export default FakeOrders;