export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  border: string;
  shadow: string;
}

export interface ThemeFonts {
  bold: string;
  semiBold: string;
  medium: string;
  regular: string;
  light: string;
  thin: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}
