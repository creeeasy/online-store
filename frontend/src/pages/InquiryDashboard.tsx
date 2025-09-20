import React from 'react';
import InquiryList from '../components/InquiryList';
import InquiryStats from '../components/InquiryStats';
import { useTheme } from '../contexts/ThemeContext';

const InquiryDashboard: React.FC = () => {
  const { theme } = useTheme();
  
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background
  };

  const innerContainerStyle: React.CSSProperties = {
    maxWidth: '80rem', // max-w-7xl equivalent
    margin: '0 auto',
    padding: `0 ${theme.spacing.lg}`,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.875rem',
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    margin: 0
  };

  const subtitleStyle: React.CSSProperties = {
    marginTop: theme.spacing.sm,
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    margin: `${theme.spacing.sm} 0 0 0`
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing.xl
  };

  const gridLargeStyle: React.CSSProperties = {
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '2fr 1fr'
    }
  };

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Order Inquiries</h1>
          <p style={subtitleStyle}>Manage and track customer inquiries</p>
        </div>
                
        <div style={{ ...gridStyle, ...gridLargeStyle }}>
          <div style={{ gridColumn: 'span 2 / span 2' }}>
            <InquiryList />
          </div>
                    
          <div style={{ gridColumn: 'span 1 / span 1' }}>
            <InquiryStats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDashboard;