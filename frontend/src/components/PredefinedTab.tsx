import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IProduct } from '../types/product';

interface PredefinedTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
}

const PredefinedTab: React.FC<PredefinedTabProps> = ({ formData, setFormData }) => {
  const { theme } = useTheme();

  const handlePredefinedFieldToggle = (category: string, isActive: boolean) => {
    setFormData(prev => ({
      ...prev,
      predefinedFields: (prev.predefinedFields || []).map(field =>
        field.category === category ? { ...field, isActive } : field
      )
    }));
  };

  const handlePredefinedOptionToggle = (category: string, option: string, isSelected: boolean) => {
    setFormData(prev => ({
      ...prev,
      predefinedFields: (prev.predefinedFields || []).map(field => {
        if (field.category === category) {
          const selectedOptions = isSelected
            ? [...field.selectedOptions, option]
            : field.selectedOptions.filter(opt => opt !== option);
          return { ...field, selectedOptions };
        }
        return field;
      })
    }));
  };

  // Theme-based styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    margin: 0,
    marginBottom: theme.spacing.md
  };

  const categoryCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm
  };

  const categoryHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  };

  const categoryLabelStyle: React.CSSProperties = {
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textTransform: 'capitalize',
    fontSize: '1rem'
  };

  const toggleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const statusTextStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '0.875rem',
    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
    fontWeight: theme.fonts.medium
  });

  const toggleButtonStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'relative',
    display: 'inline-flex',
    height: '24px',
    width: '44px',
    alignItems: 'center',
    borderRadius: '12px',
    backgroundColor: isActive ? theme.colors.primary : theme.colors.border,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none'
  });

  const toggleKnobStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'inline-block',
    height: '16px',
    width: '16px',
    borderRadius: '50%',
    backgroundColor: theme.colors.secondary,
    transition: 'transform 0.3s ease',
    transform: isActive ? 'translateX(24px)' : 'translateX(4px)',
    boxShadow: theme.shadows.sm
  });

  const optionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm
  };

  const optionsLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.medium,
    marginBottom: theme.spacing.sm
  };

  const optionsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.sm
  };

  const optionLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent'
  };

  const checkboxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    accentColor: theme.colors.primary,
    cursor: 'pointer'
  };

  const optionTextStyle: React.CSSProperties = {
    marginLeft: theme.spacing.sm,
    fontSize: '0.875rem',
    color: theme.colors.text,
    textTransform: 'capitalize',
    lineHeight: '1.25'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    border: `2px dashed ${theme.colors.border}`
  };

  const emptyStateTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    margin: 0,
    fontStyle: 'italic'
  };

  // If no predefined fields exist
  if (!formData.predefinedFields || formData.predefinedFields.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={headerStyle}>Product Categories</h3>
        <div style={emptyStateStyle}>
          <p style={emptyStateTextStyle}>
            No predefined categories available. Categories will appear here when configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>Product Categories</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
        {formData.predefinedFields.map((field) => (
          <div key={field.category} style={categoryCardStyle}>
            <div style={categoryHeaderStyle}>
              <label style={categoryLabelStyle}>
                {field.category}
              </label>
              <div style={toggleContainerStyle}>
                <span style={statusTextStyle(field.isActive)}>
                  {field.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  type="button"
                  onClick={() => handlePredefinedFieldToggle(field.category, !field.isActive)}
                  style={toggleButtonStyle(field.isActive)}
                  onMouseEnter={(e) => {
                    if (field.isActive) {
                      e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                    } else {
                      e.currentTarget.style.backgroundColor = theme.colors.textMuted;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = field.isActive ? theme.colors.primary : theme.colors.border;
                  }}
                  aria-label={`Toggle ${field.category} category`}
                >
                  <span style={toggleKnobStyle(field.isActive)} />
                </button>
              </div>
            </div>
            
            {field.isActive && (
              <div style={optionsContainerStyle}>
                <p style={optionsLabelStyle}>Select available options:</p>
                <div style={optionsGridStyle}>
                  {field.options.map(option => (
                    <label 
                      key={option} 
                      style={optionLabelStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={field.selectedOptions.includes(option)}
                        onChange={(e) => handlePredefinedOptionToggle(field.category, option, e.target.checked)}
                        style={checkboxStyle}
                      />
                      <span style={optionTextStyle}>{option}</span>
                    </label>
                  ))}
                </div>
                
                {field.selectedOptions.length > 0 && (
                  <div style={{
                    marginTop: theme.spacing.sm,
                    padding: theme.spacing.sm,
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.primary}20`
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: theme.colors.textSecondary,
                      margin: 0,
                      marginBottom: theme.spacing.xs,
                      fontWeight: theme.fonts.medium
                    }}>
                      Selected ({field.selectedOptions.length}):
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: theme.colors.text,
                      margin: 0,
                      fontWeight: theme.fonts.regular
                    }}>
                      {field.selectedOptions.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredefinedTab;