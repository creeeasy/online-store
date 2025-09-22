// src/components/ProductForm/ProductFormTabs.tsx
import React from 'react';
import { FiPackage, FiCheck, FiGift, FiEyeOff, FiTag, FiX, FiDroplet } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const tabConfig = [
  { id: 'basic', label: 'Basic Info', icon: FiPackage },
  { id: 'predefined', label: 'Categories', icon: FiCheck },
  { id: 'offers', label: 'Offers', icon: FiGift },
  { id: 'hidden', label: 'Hidden', icon: FiEyeOff },
  { id: 'dynamic', label: 'Custom Fields', icon: FiTag },
  { id: 'colors', label: 'Colors', icon: FiDroplet }, // Added 'colors' tab
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

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md
  };

  const iconContainerStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.sm
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    fontWeight: theme.fonts.bold,
    margin: 0,
    color: theme.colors.secondary,
    letterSpacing: '0.5px'
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.85rem',
    margin: 0,
    marginTop: theme.spacing.xs
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

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2px',
    overflowX: 'auto',
    borderBottom: `2px solid rgba(255,255,255,0.25)`,
    paddingBottom: theme.spacing.sm
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.9rem',
    fontWeight: isActive ? theme.fonts.semiBold : theme.fonts.medium,
    whiteSpace: 'nowrap',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive 
      ? theme.colors.secondary 
      : 'transparent',
    color: isActive 
      ? theme.colors.text 
      : theme.colors.secondary,
    boxShadow: isActive ? theme.shadows.sm : 'none',
    transform: isActive ? 'translateY(-2px)' : 'none'
  });

  const keyframes = `
    @keyframes tabHighlight {
      0% { transform: scaleX(0); opacity: 0; }
      100% { transform: scaleX(1); opacity: 1; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={headerContainerStyle}>
        <div style={headerContentStyle}>
          <div style={headerLeftStyle}>
            <div style={iconContainerStyle}>
              {currentTab?.icon && React.createElement(currentTab.icon, { size: 22 })}
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
                {React.createElement(tab.icon, { size: 16 })}
                {tab.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: theme.colors.secondary,
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
    </>
  );
};

export default ProductFormTabs;