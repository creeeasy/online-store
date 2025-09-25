import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import type { ValidationError } from '../utils/validation';

interface ErrorDisplayProps {
  errors: ValidationError[];
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, className = '' }) => {
  const { theme } = useTheme();

  if (!errors || errors.length === 0) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: `${theme.colors.error}08`,
    border: `1px solid ${theme.colors.error}30`,
    borderRadius: '8px',
    animation: 'slideIn 0.3s ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    color: theme.colors.error,
    fontSize: '0.9rem',
    fontWeight: '600',
  };

  const listStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const errorItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    color: theme.colors.error,
    fontSize: '0.85rem',
    lineHeight: '1.4',
  };

  const bulletStyle: React.CSSProperties = {
    width: '4px',
    height: '4px',
    backgroundColor: theme.colors.error,
    borderRadius: '50%',
    marginTop: '0.5rem',
    flexShrink: 0,
  };

  const keyframes = `
    @keyframes slideIn {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle} className={className}>
        <div style={headerStyle}>
          <FiAlertTriangle size={16} />
          Please fix the following errors:
        </div>
        <ul style={listStyle}>
          {errors.map((error, index) => (
            <li key={index} style={errorItemStyle}>
              <div style={bulletStyle} />
              <span>{error.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ErrorDisplay;