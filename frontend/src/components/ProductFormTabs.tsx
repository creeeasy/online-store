import React from 'react';
import { FiX, FiPackage, FiLayers, FiPercent, FiHash, FiEyeOff, FiEdit3, FiArrowUpLeft } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

// ✅ Updated tab configuration with quantity tab and icons
const tabConfig = [
  { id: 'basic', label: 'Basic Info', icon: FiPackage, description: 'Name, price, and description' },
  { id: 'quantity', label: 'Quantity', icon: FiHash, description: 'Order inquiry settings' },
  { id: 'offers', label: 'Offers', icon: FiPercent, description: 'Promotions and discounts' },
  { id: 'predefined', label: 'Categories', icon: FiLayers, description: 'Product categories' },
  { id: 'colors', label: 'Colors', icon: FiArrowUpLeft, description: 'Color variations' },
  { id: 'dynamic', label: 'Custom Fields', icon: FiEdit3, description: 'Customer form fields' },
  { id: 'hidden', label: 'Hidden', icon: FiEyeOff, description: 'Internal data fields' },
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
    padding: `${theme.spacing?.lg || '1.5rem'} ${theme.spacing?.xl || '2rem'}`,
    color: theme.colors.secondary || theme.colors.textOnPrimary,
    borderTopLeftRadius: theme.borderRadius?.lg || '16px',
    borderTopRightRadius: theme.borderRadius?.lg || '16px',
    boxShadow: theme.shadows?.md || `0 4px 12px ${theme.colors.shadow}`
  };

  const headerContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing?.md || '1rem'
  };

  const titleGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    fontWeight: theme.fonts?.weight?.bold || '700',
    margin: 0,
    color: theme.colors.secondary || theme.colors.textOnPrimary,
    letterSpacing: '0.5px'
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.85rem',
    margin: 0,
    marginTop: theme.spacing?.xs || '0.25rem',
    fontWeight: theme.fonts?.weight?.light || '300'
  };

  const closeButtonStyle: React.CSSProperties = {
    padding: theme.spacing?.sm || '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    borderRadius: theme.borderRadius?.md || '8px',
    color: theme.colors.secondary || theme.colors.textOnPrimary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Enhanced tabs styles
  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    overflowX: 'auto',
    borderBottom: `2px solid rgba(255,255,255,0.25)`,
    paddingBottom: theme.spacing?.sm || '0.75rem',
    position: 'relative',
    scrollbarWidth: 'thin'
  };

  const tabButtonStyle = (isActive: boolean, tab: typeof tabConfig[0]): React.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: `${theme.spacing?.sm || '0.75rem'} ${theme.spacing?.lg || '1.5rem'}`,
    borderRadius: theme.borderRadius?.md || '8px',
    fontSize: '0.875rem',
    fontWeight: isActive ? (theme.fonts?.weight?.semiBold || '600') : (theme.fonts?.weight?.medium || '500'),
    textTransform: 'none',
    letterSpacing: '0.3px',
    transition: 'all 0.25s ease',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? theme.colors.secondary || 'white' : 'transparent',
    color: isActive ? (theme.colors.text || theme.colors.primary) : (theme.colors.secondary || 'white'),
    boxShadow: isActive ? (theme.shadows?.sm || '0 2px 4px rgba(0,0,0,0.1)') : 'none',
    transform: isActive ? 'translateY(-2px)' : 'none',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content'
  });

  const tabIconStyle = (isActive: boolean): React.CSSProperties => ({
    flexShrink: 0,
    opacity: isActive ? 1 : 0.8
  });

  const tabContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  };

  const tabDescriptionStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '0.7rem',
    opacity: isActive ? 0.7 : 0.6,
    marginTop: '1px',
    lineHeight: 1.2
  });

  const progressIndicatorStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    marginTop: '0.5rem'
  };

  const progressDotStyle = (isCompleted: boolean, isCurrent: boolean): React.CSSProperties => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: isCompleted || isCurrent 
      ? 'rgba(255, 255, 255, 0.9)' 
      : 'rgba(255, 255, 255, 0.3)',
    transition: 'all 0.2s ease'
  });

  // Get current tab index for progress indication
  const currentTabIndex = tabConfig.findIndex(tab => tab.id === activeTab);

  return (
    <div style={headerContainerStyle}>
      <div style={headerContentStyle}>
        <div style={titleGroupStyle}>
          <h2 style={titleStyle}>
            {isEditing ? 'Edit Product' : 'Create New Product'}
          </h2>
          <p style={subtitleStyle}>
            {currentTab 
              ? `${currentTab.label}: ${currentTab.description}` 
              : 'Configure product details and order settings'
            }
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
            title="Close form"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
      
      <div style={tabsContainerStyle}>
        {tabConfig.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={tabButtonStyle(isActive, tab)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              title={`${tab.label}: ${tab.description}`}
            >
              <Icon size={16} style={tabIconStyle(isActive)} />
              <div style={tabContentStyle}>
                <span>{tab.label}</span>
                <span style={tabDescriptionStyle(isActive)}>{tab.description}</span>
              </div>
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

      {/* Progress indicator */}
      <div style={progressIndicatorStyle}>
        {tabConfig.map((_, index) => (
          <div 
            key={index}
            style={progressDotStyle(index < currentTabIndex, index === currentTabIndex)}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes tabHighlight {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductFormTabs;