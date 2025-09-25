
import React from 'react';
import { 
  FiInfo, 
  FiPackage, 
  FiTag, 
  FiEyeOff, 
  FiSliders, 
} from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { BsFillGrid3X3GapFill, BsFillPaletteFill } from 'react-icons/bs';

interface ProductFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasTabErrors: (tabName: string) => boolean;
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({
  activeTab,
  setActiveTab,
  hasTabErrors,
}) => {
  const { theme } = useTheme();

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiInfo },
    { id: 'quantity', label: 'Quantity', icon: FiPackage },
    { id: 'offers', label: 'Offers', icon: FiTag },
    { id: 'colors', label: 'Colors', icon: BsFillPaletteFill },
    { id: 'predefined', label: 'Categories', icon: BsFillGrid3X3GapFill },
    { id: 'dynamic', label: 'Dynamic Fields', icon: FiSliders },
    { id: 'hidden', label: 'Hidden Fields', icon: FiEyeOff },
  ];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const getTabStyle = (tabId: string, isActive: boolean, hasErrors: boolean): React.CSSProperties => {
    let backgroundColor = theme.colors.surface;
    let color = theme.colors.textSecondary;
    let borderColor = 'transparent';
    
    if (isActive) {
      backgroundColor = theme.colors.backgroundSecondary;
      color = theme.colors.primary;
      borderColor = theme.colors.primary;
    } else if (hasErrors) {
      color = theme.colors.error;
    }

    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 1.5rem',
      backgroundColor,
      color,
      border: 'none',
      borderBottom: `2px solid ${borderColor}`,
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      position: 'relative',
    };
  };

  const errorIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '8px',
    height: '8px',
    backgroundColor: theme.colors.error,
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  };

  const keyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasErrors = hasTabErrors(tab.id);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={getTabStyle(tab.id, isActive, hasErrors)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  e.currentTarget.style.color = hasErrors ? theme.colors.error : theme.colors.text;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                  e.currentTarget.style.color = hasErrors ? theme.colors.error : theme.colors.textSecondary;
                }
              }}
            >
              <Icon size={18} />
              {tab.label}
              {hasErrors && <div style={errorIndicatorStyle} />}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ProductFormTabs;