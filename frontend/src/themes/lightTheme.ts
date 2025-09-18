import type { Theme } from "../types/theme";

export const lightTheme: Theme = {
  colors: {
    // Primary colors (Light Orange variations)
    primary: '#FF8A65',        // Main light orange
    primaryLight: '#FFB74D',   // Lighter orange
    primaryDark: '#FF7043',    // Darker orange
    
    // Secondary colors (White variations)
    secondary: '#FFFFFF',      // Pure white
    secondaryLight: '#FAFAFA', // Off white
    secondaryDark: '#F5F5F5',  // Light gray-white
    
    // Background colors
    background: '#FFFFFF',      // Main background
    backgroundSecondary: '#FFF3E0', // Light orange tint
    surface: '#FFFFFF',         // Card/surface background
    
    // Text colors
    text: '#212121',           // Primary text
    textSecondary: '#757575',  // Secondary text
    textMuted: '#BDBDBD',      // Muted text
    
    // Accent and utility colors
    accent: '#FFB74D',         // Accent color
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
