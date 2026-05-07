import { alpha, createTheme, responsiveFontSizes, type Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    dashboard: {
      glass: string;
      glassBorder: string;
      cardRadius: number | string;
      transition: string;
      contentMaxWidth: number;
      contentPadding: string;
    };
  }
  interface ThemeOptions {
    dashboard?: {
      glass?: string;
      glassBorder?: string;
      cardRadius?: number | string;
      transition?: string;
      contentMaxWidth?: number;
      contentPadding?: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    cta: true;
    ghost: true;
  }
}

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7c3aed' },         // purple/violet
    secondary: { main: '#6366f1' },       // indigo accent
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    info: { main: '#0ea5e9' },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b'
    }
  },
  shape: { borderRadius: 8 },
});

let theme = createTheme(baseTheme, {
  dashboard: {
    glass: 'rgba(255, 255, 255, 0.9)',
    glassBorder: 'rgba(226, 232, 240, 0.6)',
    cardRadius: baseTheme.shape.borderRadius * 2,
    transition: '0.2s ease-in-out',
    contentMaxWidth: 1400,
    contentPadding: baseTheme.spacing(3)
  },
  typography: {
    fontFamily: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`,
    htmlFontSize: 16,
    fontSize: 13, // Reduced from 14 for higher density
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontSize: '2rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 800,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    subtitle1: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.57 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, fontWeight: 500 },
    overline: { fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 2.5 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderRadius: theme.shape.borderRadius * 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          backgroundColor: theme.palette.background.paper,
        })
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          padding: theme.spacing(1, 1.75),
          borderColor: theme.palette.divider,
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow: 'none',
          padding: theme.spacing(1, 3),
          fontWeight: 600,
        }),
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          }
        }
      },
      variants: [
        {
          props: { variant: 'cta' },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: theme.spacing(1, 2.75),
            borderRadius: theme.shape.borderRadius,
            fontWeight: 700,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          })
        },
        {
          props: { variant: 'ghost' },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: alpha(theme.palette.text.primary, 0.04),
            color: theme.palette.text.primary,
            padding: theme.spacing(1, 2.25),
            borderRadius: theme.shape.borderRadius,
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.primary, 0.08),
            }
          })
        }
      ]
    }
  }
});

theme = responsiveFontSizes(theme);
export default theme;

