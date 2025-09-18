
import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useThemeStyles = () => {
  const { theme } = useTheme();

  const styles = useMemo(() => ({
    // Button styles
    primaryButton: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.secondary,
      fontWeight: theme.fonts.semiBold,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      border: 'none',
      boxShadow: theme.shadows.sm,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,

    secondaryButton: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      fontWeight: theme.fonts.medium,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.primary}`,
      boxShadow: theme.shadows.sm,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,

    // Card styles
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.md,
      padding: theme.spacing.lg,
      border: `1px solid ${theme.colors.border}`,
    } as React.CSSProperties,

    // Typography styles
    heading: {
      color: theme.colors.text,
      fontWeight: theme.fonts.bold,
      margin: 0,
    } as React.CSSProperties,

    bodyText: {
      color: theme.colors.textSecondary,
      fontWeight: theme.fonts.regular,
      lineHeight: '1.6',
    } as React.CSSProperties,

    // Container styles
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      padding: theme.spacing.md,
    } as React.CSSProperties,
  }), [theme]);

  return styles;
};



