import type { Theme } from "../types/theme";

export const lightTheme: Theme = {
  colors: {
    // Primary colors (Blue variations)
    primary: '#1E73BE',        // Main royal blue
    primaryLight: '#4DA8DA',   // Lighter blue
    primaryDark: '#155A9C',    // Darker blue
    
    // Secondary colors (White variations)
    secondary: '#FFFFFF',      // Pure white
    secondaryLight: '#FAFAFA', // Off white
    secondaryDark: '#F5F5F5',  // Light gray-white
    
    // Background colors
    background: '#FFFFFF',          // Main background
    backgroundSecondary: '#EAF4FB', // Very light blue tint
    surface: '#FFFFFF',             // Card/surface background
    
    // Text colors
    text: '#212121',           // Primary text (blackish)
    textSecondary: '#757575',  // Secondary text (gray)
    textMuted: '#BDBDBD',      // Muted text (light gray)
    
    // Accent and utility colors
    accent: '#4DA8DA',         // Accent color (sky blue)
    border: '#E0E0E0',         // Border color
    shadow: 'rgba(0, 0, 0, 0.1)', // Shadow color
  },
  fonts: {
    bold: '700',      // Bold weight
    semiBold: '600',  // Semi-bold weight
    medium: '500',    // Medium weight
    regular: '400',   // Regular weight
    light: '300',     // Light weight
    thin: '200',      // Thin weight
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.15)',
  }
};
