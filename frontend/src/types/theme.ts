// === Colors ===
export interface ThemeColors {
  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Neutrals
  white: string;
  black: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;

  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceAlt: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  textOnSecondary: string;
  textInverse: string;

  // Feedback
  success: string;
  warning: string;
  error: string;
  info: string;

  // States
  hover: string;
  pressed: string;
  disabled: string;

  // Borders & Shadows
  border: string;
  borderStrong: string;
  shadow: string;

  // Gradients
  gradientPrimary: string;
  gradientSecondary: string;
}

// === Fonts ===
export interface ThemeFonts {
  family: {
    heading: string;
    body: string;
    monospace: string;
  };
  weight: {
    thin: string;
    extraLight: string;
    light: string;
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
    extraBold: string;
    black: string;
  };
  size: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  lineHeight: {
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

// === Theme ===
export interface Theme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndex: {
    hide: number;
    base: number;
    dropdown: number;
    sticky: number;
    overlay: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
}
