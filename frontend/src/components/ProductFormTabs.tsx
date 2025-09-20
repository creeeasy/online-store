// src/components/ProductForm/ProductFormTabs.tsx
import React from 'react';
import { FiPackage, FiCheck, FiGift, FiEyeOff, FiTag, FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const tabConfig = [
  { id: 'basic', label: 'Basic Info', icon: FiPackage },
  { id: 'predefined', label: 'Categories', icon: FiCheck },
  { id: 'offers', label: 'Offers', icon: FiGift },
  { id: 'hidden', label: 'Hidden', icon: FiEyeOff },
  { id: 'dynamic', label: 'Custom Fields', icon: FiTag },
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

  // Theme-based styles
  const headerContainerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    padding: theme.spacing.xl,
    color: theme.colors.secondary
  };

  const headerContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md
  };

  const iconContainerStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: theme.fonts.bold,
    margin: 0,
    color: theme.colors.secondary
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.875rem',
    margin: 0,
    marginTop: theme.spacing.xs
  };

  const closeButtonStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    color: theme.colors.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2px',
    overflowX: 'auto'
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive 
      ? theme.colors.secondary 
      : 'rgba(255, 255, 255, 0.2)',
    color: isActive 
      ? theme.colors.text 
      : theme.colors.secondary
  });

  return (
    <div style={headerContainerStyle}>
      <div style={headerContentStyle}>
        <div style={headerLeftStyle}>
          <div style={iconContainerStyle}>
            {currentTab?.icon && React.createElement(currentTab.icon, { size: 24 })}
          </div>
          <div>
            <h2 style={titleStyle}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={subtitleStyle}>Manage product details and configuration</p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            aria-label="Close form"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
      
      <div style={tabsContainerStyle}>
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            {React.createElement(tab.icon, { size: 16 })}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFormTabs;