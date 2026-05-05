import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    dashboard: {
      glass: string;
      glassBorder: string;
      cardRadius: number | string;
      transition: string;
    };
  }
  interface ThemeOptions {
    dashboard?: {
      glass?: string;
      glassBorder?: string;
      cardRadius?: number | string;
      transition?: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    cta: true;
    ghost: true;
  }
}

let theme = createTheme({
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
  shape: { borderRadius: 12 },
  dashboard: {
    glass: 'rgba(255, 255, 255, 0.9)',
    glassBorder: 'rgba(226, 232, 240, 0.6)',
    cardRadius: '1.5rem',
    transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  typography: {
    fontFamily: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`,
    htmlFontSize: 16,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: { 
      fontSize: '2.5rem', 
      fontWeight: 800, 
      letterSpacing: '-0.02em', 
      lineHeight: 1.2,
      '@media (max-width:600px)': { fontSize: '1.75rem', fontWeight: 700 } 
    },
    h2: { 
      fontSize: '2.125rem', 
      fontWeight: 800, 
      letterSpacing: '-0.02em', 
      lineHeight: 1.2,
      '@media (max-width:600px)': { fontSize: '1.5rem', fontWeight: 700 }
    },
    h3: { 
      fontSize: '1.75rem', 
      fontWeight: 700, 
      letterSpacing: '-0.02em', 
      lineHeight: 1.3,
      '@media (max-width:600px)': { fontSize: '1.25rem' }
    },
    h4: { 
      fontSize: '1.875rem', 
      fontWeight: 800, 
      letterSpacing: '-0.015em', 
      lineHeight: 1.3,
      '@media (max-width:600px)': { fontSize: '1.35rem' }
    },
    h5: { 
      fontSize: '1.25rem', 
      fontWeight: 700, 
      lineHeight: 1.4,
      '@media (max-width:600px)': { fontSize: '1rem' }
    },
    h6: { 
      fontSize: '1.125rem', 
      fontWeight: 700, 
      lineHeight: 1.4,
      '@media (max-width:600px)': { fontSize: '0.95rem' }
    },
    subtitle1: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.5 },
    subtitle2: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    caption: { fontSize: '0.8125rem', lineHeight: 1.5, fontWeight: 500 }, // 13px
    overline: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 2.5 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24, // var(--border-radius-xl) is 1.5rem = 24px
          border: '1px solid rgba(226, 232, 240, 0.6)',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px) saturate(180%)',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 14px',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0px 3px 3px #2f3f5359'
        }
      },
      // Custom variants
      variants: [
        {
          // Blush CTA
          props: { variant: 'cta' },
          style: {
            backgroundColor: '#ff7f88',
            color: '#fff',
            padding: '8px 22px',
            borderRadius: 12,
            fontWeight: 600,
            boxShadow: '0px 3px 10px rgba(255,120,136,0.40)',
            ':hover': { backgroundColor: '#ff6773' }
          }
        },
        {
          // Subtle gray “ghost” button
          props: { variant: 'ghost' },
          style: {
            backgroundColor: '#f1f5f9',
            color: '#0f172a',
            padding: '8px 18px',
            borderRadius: 12,
            ':hover': { backgroundColor: '#e2e8f0' }
          }
        }
      ]
    }
  }
});

theme = responsiveFontSizes(theme);
export default theme;

