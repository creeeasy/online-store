import type { Theme } from "../types/theme";

// A cheerful blue-teal theme
export const lightTheme: Theme = {
  colors: {
    // === BRAND COLORS ===
    primary: '#1E73BE',           // Royal blue
    primaryLight: '#4DA8DA',      // Sky blue
    primaryDark: '#155A9C',       // Deep ocean blue

    secondary: '#2BBBAD',         // Teal (fresh accent)
    secondaryLight: '#7DDAD1',    // Soft aqua
    secondaryDark: '#1E7D74',     // Deep teal

    // === NEUTRALS ===
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',

    // === BACKGROUNDS ===
    background: '#FFFFFF',             // Main background
    backgroundSecondary: '#F5FAFD',    // Soft sky blue tint
    surface: '#FFFFFF',                // Card/surface
    surfaceAlt: '#F0F7FA',             // Alternate card

    // === TEXT ===
    text: '#212121',
    textSecondary: '#555F61',
    textMuted: '#9E9E9E',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    textInverse: '#FFFFFF',

    // === FEEDBACK ===
    success: '#4CAF50',        // Green
    warning: '#FFD166',        // Soft amber (less harsh than yellow)
    error: '#E57373',          // Gentle red (muted)
    info: '#2196F3',           // Bright info blue

    // === STATES ===
    hover: 'rgba(30, 115, 190, 0.08)',
    pressed: 'rgba(30, 115, 190, 0.16)',
    disabled: '#E0E0E0',

    // === BORDERS & SHADOWS ===
    border: '#E0E0E0',
    borderStrong: '#BDBDBD',
    shadow: 'rgba(0, 0, 0, 0.08)',

    // === GRADIENTS ===
    gradientPrimary: 'linear-gradient(135deg, #1E73BE 0%, #4DA8DA 100%)',
    gradientSecondary: 'linear-gradient(135deg, #2BBBAD 0%, #7DDAD1 100%)',
  },

  fonts: {
    family: {
      heading: `'Poppins', 'Helvetica Neue', Arial, sans-serif`,
      body: `'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
      monospace: `'Fira Code', monospace`,
    },
    weight: {
      thin: '100',
      extraLight: '200',
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
      extraBold: '800',
      black: '900',
    },
    size: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      md: '1rem',      // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',   // 48px
    },
    lineHeight: {
      tight: '1.2',
      snug: '1.35',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  spacing: {
    none: '0',
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '1rem',       // 16px
    full: '9999px',   // Circular
  },

  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.15)',
    xl: '0 20px 25px rgba(0,0,0,0.2)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },

  transitions: {
    fast: 'all 0.15s ease-in-out',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },

  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },
};
