// src/components/ProductForm/ProductFormTabs.tsx
import React from 'react';
import { FiX } from 'react-icons/fi'; // Keeping close button for usability
import { useTheme } from '../contexts/ThemeContext';

const tabConfig = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'predefined', label: 'Categories' },
  { id: 'offers', label: 'Offers' },
  { id: 'hidden', label: 'Hidden' },
  { id: 'dynamic', label: 'Custom Fields' },
  { id: 'colors', label: 'Colors' }, // Colors tab still here
];

interface ProductFormTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  onCancel, 
  isEditing = false 
}) => {
  const { theme } = useTheme();
  const currentTab = tabConfig.find(tab => tab.id === activeTab);

  // Header styles
  const headerContainerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    color: theme.colors.secondary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md
  };

  const headerContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  };

  const titleGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    fontWeight: theme.fonts.weight.bold,
    margin: 0,
    color: theme.colors.secondary,
    letterSpacing: '0.5px'
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.85rem',
    margin: 0,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fonts.weight.light
  };

  const closeButtonStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    color: theme.colors.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Tabs styles
  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2px',
    overflowX: 'auto',
    borderBottom: `2px solid rgba(255,255,255,0.25)`,
    paddingBottom: theme.spacing.sm,
    position: 'relative'
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'relative',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.95rem',
    fontWeight: isActive ? theme.fonts.weight.semiBold : theme.fonts.weight.medium,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    transition: 'all 0.25s ease',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? theme.colors.secondary : 'transparent',
    color: isActive ? theme.colors.text : theme.colors.secondary,
    boxShadow: isActive ? theme.shadows.sm : 'none',
    transform: isActive ? 'translateY(-2px)' : 'none'
  });

  return (
    <div style={headerContainerStyle}>
      <div style={headerContentStyle}>
        <div style={titleGroupStyle}>
          <h2 style={titleStyle}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p style={subtitleStyle}>
            {currentTab ? `Currently on: ${currentTab.label}` : 'Manage product details'}
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            aria-label="Close form"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
      
      <div style={tabsContainerStyle}>
        {tabConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={tabButtonStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: theme.colors.primary,
                    borderRadius: '2px',
                    animation: 'tabHighlight 0.3s ease'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFormTabs;
